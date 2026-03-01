// ╔══════════════════════════════════════════════════════════════╗
// ║  BINYAH DR SERVICE — Shared Data Layer                      ║
// ║  Both Dashboard and Form import this single module          ║
// ╚══════════════════════════════════════════════════════════════╝

const DR_COLLECTION = 'deficiency_reports';

// ─── ENUMS (Shared Constants) ───
const DR_STATUS = {
  OPEN:         'Open',
  UNDER_REVIEW: 'Under Review',
  REJECTED:     'Rejected',
  CLOSED:       'Closed'
};

const DR_SEVERITY = {
  MINOR:    'Minor',
  MAJOR:    'Major',
  CRITICAL: 'Critical'
};

const DR_DISCIPLINES = [
  'Architectural', 'Civil', 'Structural', 'MEP - Mechanical',
  'MEP - Electrical', 'MEP - Plumbing', 'Fire Protection',
  'Elevator', 'BMS/LCS', 'Landscaping', 'Roads & Infrastructure'
];

const DR_SUBCONTRACTORS = [
  'Al Bawani', 'Saudi Binladin', 'El Seif Engineering',
  'Nesma & Partners', 'Al Arrab Contracting', 'Almabani',
  'Haif Company', 'Modern Building Leaders', 'Other'
];

// ─── DR SERVICE ───
const DRService = {

  // Generate next DR number
  async getNextDRNumber() {
    const snap = await db.collection(DR_COLLECTION)
      .orderBy('drNumeric', 'desc').limit(1).get();
    if (snap.empty) return { display: 'DR-0001', numeric: 1 };
    const last = snap.docs[0].data().drNumeric || 0;
    const next = last + 1;
    return { display: `DR-${String(next).padStart(4, '0')}`, numeric: next };
  },

  // Create a new DR
  async createDR(data) {
    const { display, numeric } = await this.getNextDRNumber();
    const now = firebase.firestore.FieldValue.serverTimestamp();

    const drDoc = {
      drNumber:        display,
      drNumeric:       numeric,
      projectCode:     data.projectCode || 'NCD408',
      discipline:      data.discipline || '',
      subcontractor:   data.subcontractor || '',
      location:        data.location || '',
      description:     data.description || '',
      severity:        data.severity || DR_SEVERITY.MINOR,
      status:          DR_STATUS.OPEN,
      issuedDate:      data.issuedDate ? firebase.firestore.Timestamp.fromDate(new Date(data.issuedDate)) : now,
      dueDate:         data.dueDate ? firebase.firestore.Timestamp.fromDate(new Date(data.dueDate)) : null,
      closedDate:      null,
      issuedBy:        data.issuedBy || 'QA/QC Inspector',
      closedBy:        null,
      correctiveAction:data.correctiveAction || '',
      remarks:         data.remarks || '',
      photoURLs:       data.photoURLs || [],
      signatures:      data.signatures || {},
      createdAt:       now,
      updatedAt:       now
    };

    const ref = await db.collection(DR_COLLECTION).add(drDoc);
    
    // Audit log
    await ref.collection('audit_log').add({
      action: 'CREATED',
      by: data.issuedBy || 'System',
      at: now,
      details: `DR ${display} created`
    });

    return { id: ref.id, drNumber: display };
  },

  // Update existing DR
  async updateDR(docId, data) {
    const now = firebase.firestore.FieldValue.serverTimestamp();
    const ref = db.collection(DR_COLLECTION).doc(docId);

    // Convert date strings to Timestamps
    const updateData = { ...data, updatedAt: now };
    if (data.issuedDate && typeof data.issuedDate === 'string') {
      updateData.issuedDate = firebase.firestore.Timestamp.fromDate(new Date(data.issuedDate));
    }
    if (data.dueDate && typeof data.dueDate === 'string') {
      updateData.dueDate = firebase.firestore.Timestamp.fromDate(new Date(data.dueDate));
    }
    if (data.closedDate && typeof data.closedDate === 'string') {
      updateData.closedDate = firebase.firestore.Timestamp.fromDate(new Date(data.closedDate));
    }

    await ref.update(updateData);

    // Audit log
    await ref.collection('audit_log').add({
      action: 'UPDATED',
      by: 'System',
      at: now,
      details: `Fields updated: ${Object.keys(data).join(', ')}`
    });

    return true;
  },

  // Close a DR
  async closeDR(docId, closureData) {
    const now = firebase.firestore.FieldValue.serverTimestamp();
    const ref = db.collection(DR_COLLECTION).doc(docId);

    await ref.update({
      status:           DR_STATUS.CLOSED,
      closedDate:       now,
      closedBy:         closureData.closedBy || 'QA/QC Manager',
      correctiveAction: closureData.correctiveAction || '',
      remarks:          closureData.remarks || '',
      signatures:       closureData.signatures || {},
      updatedAt:        now
    });

    await ref.collection('audit_log').add({
      action: 'CLOSED',
      by: closureData.closedBy || 'System',
      at: now,
      details: 'DR closed'
    });

    return true;
  },

  // Get single DR by document ID
  async getDR(docId) {
    const doc = await db.collection(DR_COLLECTION).doc(docId).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  },

  // Get all DRs (one-time fetch)
  async listDRs(filters = {}) {
    let query = db.collection(DR_COLLECTION).orderBy('drNumeric', 'desc');
    
    if (filters.status)     query = query.where('status', '==', filters.status);
    if (filters.discipline) query = query.where('discipline', '==', filters.discipline);
    if (filters.severity)   query = query.where('severity', '==', filters.severity);

    const snap = await query.get();
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // REAL-TIME LISTENER — This is the magic that connects Dashboard to Form
  onDRsChanged(callback) {
    return db.collection(DR_COLLECTION)
      .orderBy('drNumeric', 'desc')
      .onSnapshot(snapshot => {
        const drs = [];
        snapshot.forEach(doc => {
          drs.push({ id: doc.id, ...doc.data() });
        });
        // Also pass change info for toast notifications
        const changes = snapshot.docChanges().map(change => ({
          type: change.type, // 'added', 'modified', 'removed'
          dr: { id: change.doc.id, ...change.doc.data() }
        }));
        callback(drs, changes);
      }, error => {
        console.error('Real-time listener error:', error);
      });
  },

  // Delete DR
  async deleteDR(docId) {
    await db.collection(DR_COLLECTION).doc(docId).delete();
    return true;
  },

  // Upload photo to Firebase Storage
  async uploadPhoto(file, drNumber) {
    const user = auth.currentUser;
    const timestamp = Date.now();
    const path = `dr_photos/${drNumber}/${timestamp}_${file.name}`;
    const ref = storage.ref(path);
    
    const snap = await ref.put(file);
    const url = await snap.ref.getDownloadURL();
    return url;
  },

  // Upload signature
  async uploadSignature(dataURL, drNumber, type) {
    const blob = await (await fetch(dataURL)).blob();
    const path = `signatures/${drNumber}/${type}_${Date.now()}.png`;
    const ref = storage.ref(path);
    
    const snap = await ref.put(blob);
    const url = await snap.ref.getDownloadURL();
    return url;
  },

  // Helper: format Firestore Timestamp to string
  formatDate(ts) {
    if (!ts) return '—';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  },

  formatDateTime(ts) {
    if (!ts) return '—';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }
};

console.log('📋 DR Service loaded — shared data layer ready');
