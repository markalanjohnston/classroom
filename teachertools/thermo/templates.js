/* =========================================================
   Templates for Thermo. Each template defines:
     - metadata for the picker
     - form fields for the UI
     - defaults (optional, can read from settings/roster)
     - render(data, ctx) -> HTML string (receipt body)
     - usesSerial: if true, printing bumps the serial counter

   ctx is provided by app.js and contains:
     settings : { teacher, classes[], defaultClass, expiryLabel, serial }
     now      : Date
     escape(s): HTML-escape helper
     fmtDate(d), fmtTime(d), fmtDateTime(d)
     divider(char?), rule()  : visual horizontal rules (ASCII)
     pad4(n)                 : zero-pad serial number to 4 digits
   ========================================================= */

const ENCOURAGEMENTS = [
  "You're crushing it!",
  "Keep it up!",
  "Nailed it.",
  "Absolutely stellar.",
  "Big brain energy.",
  "Clean work.",
  "That was a power move.",
  "Proud of you.",
  "First-ballot hall of famer.",
  "Peak Computer Science vibes.",
  "10/10 no notes.",
  "This is the way.",
  "Certified problem-solver.",
  "Top of the class today.",
  "You made that look easy."
];

function randomEncouragement() {
  return ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
}

const TEMPLATES = {

  /* -------------------- 1. Praise / Awesome (unified) ---- */
  praise: {
    id: 'praise',
    label: 'Good Job / Awesome',
    sub: 'Quick praise, or a formal "caught being awesome" ticket.',
    // Bump serial only when the user opted in to a ticket number on this print.
    usesSerial: (data) => data.includeTicket === true,

    fields: (ctx) => ([
      { name: 'title',       label: 'Title', type: 'select',
        options: [
          { value: 'GOOD JOB!',             label: 'GOOD JOB!' },
          { value: 'CAUGHT BEING AWESOME!', label: 'CAUGHT BEING AWESOME!' },
          { value: 'NICE WORK!',            label: 'NICE WORK!' },
          { value: 'KUDOS!',                label: 'KUDOS!' },
          { value: 'CRUSHED IT!',           label: 'CRUSHED IT!' }
        ],
        default: 'GOOD JOB!' },
      { name: 'student',     label: 'Student',       type: 'student-picker', required: true },
      { name: 'classPeriod', label: 'Class',         type: 'class-select' },
      { name: 'message',     label: 'Short message', type: 'text',
        default: randomEncouragement(),
        placeholder: 'One-line encouragement' },
      { name: 'reason',      label: 'What they did (optional, longer)', type: 'textarea',
        placeholder: 'helped a classmate debug without being asked' },
      { name: 'includeMessage', label: 'Print short message', type: 'checkbox', default: true },
      { name: 'includeClass',   label: 'Print class period',  type: 'checkbox', default: true },
      { name: 'includeTicket',  label: 'Print ticket number (formal)', type: 'checkbox', default: false }
    ]),

    shuffle: (data) => {
      data.message = randomEncouragement();
      return data;
    },

    render: (data, ctx) => {
      const e = ctx.escape;
      const name = (data.student || '').trim().toUpperCase() || '(student)';
      const title = data.title || 'GOOD JOB!';
      return `
        <div class="r">
          ${ctx.logo}
          <div class="r-divider">${ctx.divider('*')}</div>
          <div class="r-title">${e(title)}</div>
          <div class="r-divider">${ctx.divider('*')}</div>
          <div class="r-name">* ${e(name)} *</div>
          ${(data.includeClass !== false && data.classPeriod)
            ? `<div class="r-msg">${e(data.classPeriod)}</div>` : ''}
          ${(data.includeMessage !== false && data.message)
            ? `<div class="r-msg">${e(data.message)}</div>` : ''}
          ${data.reason ? `<div class="r-block">${e(data.reason)}</div>` : ''}
          <div class="r-divider">${ctx.divider('-')}</div>
          ${data.includeTicket === true
            ? `<div class="r-serial">TICKET #${ctx.pad4(ctx.settings.serial)}</div>` : ''}
          <div class="r-footer">
            <div>${e(ctx.fmtDateTime(ctx.now))}</div>
            <div class="r-sig">${e(ctx.settings.teacher)}</div>
            ${ctx.footer}
          </div>
          <div class="r-feed"></div>
        </div>`;
    }
  },

  /* -------------------- 2. Pass -------------------------- */
  pass: {
    id: 'pass',
    label: 'Pass',
    sub: 'Advisory / hall / restroom pass with timestamp.',
    usesSerial: false,

    fields: (ctx) => ([
      { name: 'passType',    label: 'Pass type', type: 'select',
        options: [
          { value: 'advisory', label: 'Advisory (to my room)' },
          { value: 'hall',     label: 'Hall pass (destination)' },
          { value: 'restroom', label: 'Restroom' }
        ],
        default: 'advisory' },
      { name: 'student',     label: 'Student',       type: 'student-picker', required: true },
      { name: 'classPeriod', label: 'Class',         type: 'class-select' },
      { name: 'destination', label: 'Destination (hall pass only)', type: 'text',
        placeholder: 'Library, Nurse, Room 204, ...' },
      { name: 'validMinutes',label: 'Valid for (minutes, optional)', type: 'number',
        placeholder: '10' },
      { name: 'freeNote',    label: 'Note (optional)', type: 'textarea' }
    ]),

    render: (data, ctx) => {
      const e = ctx.escape;
      const type = data.passType || 'advisory';
      const name = (data.student || '').trim() || '(student)';
      const teacher = ctx.settings.teacher;

      const title = {
        advisory: 'ADVISORY PASS',
        hall:     'HALL PASS',
        restroom: 'RESTROOM PASS'
      }[type];

      // Body sentence per pass type
      let body = '';
      if (type === 'advisory') {
        body = `I approve of ${name} spending this Advisory period in ${teacher}'s room.`;
      } else if (type === 'hall') {
        const dest = (data.destination || '').trim() || '(destination)';
        body = `${name} has permission to leave ${data.classPeriod || 'class'} to go to ${dest}.`;
      } else {
        body = `${name} has permission to use the restroom.`;
      }

      // Valid-until line
      let validLine = '';
      const mins = parseInt(data.validMinutes, 10);
      if (!isNaN(mins) && mins > 0) {
        const until = new Date(ctx.now.getTime() + mins * 60000);
        validLine = `Valid for ${mins} min (until ${ctx.fmtTime(until)})`;
      }

      return `
        <div class="r">
          ${ctx.logo}
          <div class="r-title">${e(title)}</div>
          <div class="r-divider">${ctx.divider('=')}</div>
          <div class="r-kv"><b>Student:</b> <span>${e(name)}</span></div>
          ${data.classPeriod ? `<div class="r-kv"><b>Class:</b> <span>${e(data.classPeriod)}</span></div>` : ''}
          <div class="r-kv"><b>Issued:</b> <span>${e(ctx.fmtDateTime(ctx.now))}</span></div>
          ${validLine ? `<div class="r-kv"><b>Valid:</b> <span>${e(validLine)}</span></div>` : ''}
          <div class="r-divider">${ctx.divider('-')}</div>
          <div class="r-block">${e(body)}</div>
          ${data.freeNote ? `<div class="r-block">${e(data.freeNote)}</div>` : ''}
          <div class="r-divider">${ctx.divider('-')}</div>
          <div class="r-sig">${e(teacher)}</div>
          ${ctx.footer}
          <div class="r-feed"></div>
        </div>`;
    }
  },

  /* -------------------- 3. Homework pass coupon ---------- */
  homework: {
    id: 'homework',
    label: 'Late Homework Pass',
    sub: 'Coupon-style "good for one late assignment".',
    usesSerial: true,

    fields: (ctx) => ([
      { name: 'student',     label: 'Student', type: 'student-picker', required: true },
      { name: 'classPeriod', label: 'Class',   type: 'class-select' },
      { name: 'expiry',      label: 'Expires', type: 'text',
        default: ctx.settings.expiryLabel }
    ]),

    render: (data, ctx) => {
      const e = ctx.escape;
      const name = (data.student || '').trim().toUpperCase() || '(student)';
      return `
        <div class="r">
          ${ctx.logo}
          <div class="r-title">LATE HOMEWORK PASS</div>
          <div class="r-coupon">
            <div class="r-msg"><b>GOOD FOR ONE (1)</b></div>
            <div class="r-msg"><b>LATE ASSIGNMENT</b></div>
            <div class="r-name">${e(name)}</div>
            ${data.classPeriod ? `<div class="r-msg">${e(data.classPeriod)}</div>` : ''}
            <div class="r-divider">${ctx.divider('-')}</div>
            <div class="r-kv"><b>Issued:</b>  <span>${e(ctx.fmtDate(ctx.now))}</span></div>
            <div class="r-kv"><b>Expires:</b> <span>${e(data.expiry || ctx.settings.expiryLabel)}</span></div>
            <div class="r-kv"><b>Coupon:</b>  <span>#${ctx.pad4(ctx.settings.serial)}</span></div>
            <div class="r-sig">${e(ctx.settings.teacher)}</div>
          </div>
          ${ctx.footer}
          <div class="r-feed"></div>
        </div>`;
    }
  }
};

TEMPLATES.phone = {
  id: 'phone',
  label: 'Phone Taken',
  sub: 'Cell-phone confiscation notice with policy excerpt.',
  usesSerial: true,
  printButtons: [
    { label: 'Print teacher record', copyLabel: '-- TEACHER RECORD (signed) --' },
    { label: 'Print student copy',   copyLabel: '-- STUDENT COPY --' },
    { label: 'Print office copy',    copyLabel: '-- BUSINESS OFFICE (w/ phone) --' }
  ],

  fields: (ctx) => ([
    { name: 'student',     label: 'Student', type: 'student-picker', required: true },
    { name: 'classPeriod', label: 'Class',   type: 'class-select' },
    { name: 'time',        label: 'Time (auto — edit if printing later)', type: 'text',
      default: ctx.fmtTime(ctx.now) },
    { name: 'device', label: 'Device', type: 'select',
      options: [
        { value: 'Cell phone',  label: 'Cell phone' },
        { value: 'Smart watch', label: 'Smart watch' },
        { value: 'AirPods',     label: 'AirPods / earbuds' },
        { value: 'Tablet',      label: 'Tablet' },
        { value: 'Laptop',      label: 'Personal laptop' },
        { value: 'Other',       label: 'Other' }
      ],
      default: 'Cell phone' },
    { name: 'pickup', label: 'Pickup instructions', type: 'textarea',
      default: ctx.settings.phonePickupDefault || '' },
    { name: 'freeNote', label: 'Note (optional)', type: 'textarea' },
    { name: 'includePickup',     label: 'Print PICKUP section',     type: 'checkbox', default: true },
    { name: 'includePolicy',     label: 'Print POLICY citation',    type: 'checkbox', default: true },
    { name: 'includeEscalation', label: 'Print EPISD ESCALATION',   type: 'checkbox', default: true }
  ]),

  render: (data, ctx) => {
    const e = ctx.escape;
    const name = (data.student || '').trim() || '(student)';
    const room = ctx.settings.room || '';
    const email = ctx.settings.contactEmail || '';
    const sigLine = '_'.repeat(28);

    const policyText      = ctx.settings.phonePolicyText || '';
    const escalationText  = ctx.settings.phoneEscalationText || '';
    const escalationLabel = ctx.settings.phoneEscalationLabel || 'ESCALATION';

    return `
      <div class="r">
        ${ctx.logo}
        <div class="r-divider">${ctx.divider('*')}</div>
        <div class="r-title">PHONE TAKEN</div>
        <div class="r-divider">${ctx.divider('*')}</div>

        <div class="r-kv"><b>Student:</b> <span>${e(name)}</span></div>
        ${data.classPeriod ? `<div class="r-kv"><b>Class:</b> <span>${e(data.classPeriod)}</span></div>` : ''}
        <div class="r-kv"><b>Date:</b> <span>${e(ctx.fmtDate(ctx.now))}</span></div>
        <div class="r-kv"><b>Time:</b> <span>${e(data.time || ctx.fmtTime(ctx.now))}</span></div>
        <div class="r-kv"><b>Device:</b> <span>${e(data.device || 'Cell phone')}</span></div>
        <div class="r-kv"><b>Record:</b> <span>#${ctx.pad4(ctx.settings.serial)}</span></div>

        ${data.includePickup !== false ? `
          <div class="r-divider">${ctx.divider('-')}</div>
          <div class="r-msg">--- PICKUP ---</div>
          <div class="r-block">${e(data.pickup || '')}</div>
        ` : ''}
        ${data.freeNote ? `
          <div class="r-divider">${ctx.divider('-')}</div>
          <div class="r-block">${e(data.freeNote)}</div>
        ` : ''}
        ${(data.includePolicy !== false && policyText.trim()) ? `
          <div class="r-divider">${ctx.divider('-')}</div>
          <div class="r-msg">--- POLICY ---</div>
          <div class="r-block">${e(policyText)}</div>
        ` : ''}
        ${(data.includeEscalation !== false && escalationText.trim()) ? `
          <div class="r-divider">${ctx.divider('-')}</div>
          <div class="r-msg">--- ${e(escalationLabel)} ---</div>
          <div class="r-block">${e(escalationText)}</div>
        ` : ''}

        <div class="r-divider">${ctx.divider('-')}</div>
        <div class="r-msg">Student signature:</div>
        <div class="r-msg">${sigLine}</div>
        ${email ? `<div class="r-msg">Questions? ${e(email)}</div>` : ''}

        <div class="r-divider">${ctx.divider('=')}</div>
        <div class="r-sig">${e(ctx.settings.teacher)}</div>
        ${room ? `<div class="r-msg">Room ${e(room)}</div>` : ''}
        ${ctx.footer}
        <div class="r-feed"></div>
      </div>`;
  }
};

const TEMPLATE_ORDER = ['praise', 'pass', 'homework', 'phone'];
