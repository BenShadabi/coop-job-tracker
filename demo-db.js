/* Demo and local database for the Co-op Job Tracker.
 *
 * The page talks to a small database API: db.collection(name).onSnapshot(cb) and
 * db.doc("jobs/<id>").update(fields). In the original build that was a shared database.
 * Here it is a few lines of localStorage, seeded with made-up postings, so you can open
 * index.html and try every tab. Your clicks (Applied, Going, Hide) are saved in your browser.
 *
 * To use your own data, replace SEED below or point window.demoDb at any store that
 * returns the same shape (see docs/data-model.md).
 */
(function () {
  var DAY = 86400000, now = Date.now();
  var iso = function (t) { return new Date(t).toISOString().slice(0, 10); };
  var ago = function (d) { return iso(now - d * DAY); };
  var ahead = function (d) { return iso(now + d * DAY); };
  var hrs = function (h) { return new Date(now - h * 3600000).toISOString(); };
  var KEY = 'coopTrackerDemo.v1';

  // All companies are made up. Any resemblance to a real posting is a coincidence.
  var SEED = {
    jobs: {
      '1001': { company: 'Northwind Bank', title: 'Data Analyst Co-op, Summer 2027', location: 'Toronto, ON', score: 82, tier: 'strong', term: 'summer', lane: '3 analyst inside a bank', status: 'ready', folder: '/Users/you/Job Applications/Northwind Bank - Data Analyst Co-op', firstSeen: hrs(3), posted: ago(0), url: 'https://example.com/jobs/1001', recruiter: { name: 'Alex Morgan', confirmed: true } },
      '1002': { company: 'Harbourfront Capital', title: 'Investment Analyst Intern', location: 'Toronto, ON', score: 76, tier: 'strong', term: 'summer', lane: '1 deals and consulting', status: 'ready', folder: '/Users/you/Job Applications/Harbourfront Capital - Investment Analyst Intern', firstSeen: hrs(9), posted: ago(0), url: 'https://example.com/jobs/1002' },
      '1003': { company: 'Maple Mutual Insurance', title: 'Risk Analytics Co-op (May start)', location: 'Toronto, ON', score: 71, tier: 'strong', term: 'summer', lane: '3 analyst inside an insurer', status: 'new', firstSeen: hrs(14), posted: ago(0), url: 'https://example.com/jobs/1003', flags: 'Check work permit' },
      '1004': { company: 'Cedar Analytics', title: 'Business Intelligence Intern', location: 'Mississauga, ON', score: 64, tier: 'maybe', term: 'summer', lane: 'BI and reporting', status: 'new', firstSeen: hrs(30), posted: ago(1), url: 'https://example.com/jobs/1004', source: 'Indeed' },
      '1005': { company: 'Lakeshore Transit', title: 'Process Improvement Co-op', location: 'Toronto, ON', score: 58, tier: 'maybe', term: 'summer', lane: 'Operations and process', status: 'new', posted: ago(2), url: 'https://example.com/jobs/1005', source: 'Lakeshore Transit careers site' },
      '1006': { company: 'Pinecrest Foods', title: 'Finance Analyst Intern', location: 'Brampton, ON', score: 52, tier: 'maybe', term: 'unknown', status: 'new', posted: ago(2), url: 'https://example.com/jobs/1006', flags: 'Check term' },
      '1007': { company: 'Granite Advisory', title: 'Consulting Analyst Co-op', location: 'Toronto, ON', score: 69, tier: 'maybe', term: 'summer', lane: '1 deals and consulting', status: 'new', deadline: ahead(4), posted: ago(6), url: 'https://example.com/jobs/1007' },
      '1008': { company: 'Birchwood Health', title: 'Project Management Office Co-op', location: 'Toronto, ON', score: 61, tier: 'maybe', term: 'summer', lane: 'PMO', status: 'ready', folder: '/Users/you/Job Applications/Birchwood Health - PMO Co-op', deadline: ahead(10), posted: ago(7), url: 'https://example.com/jobs/1008' },
      '1009': { company: 'Summit Wealth', title: 'Client Analytics Intern', location: 'Toronto, ON', score: 73, tier: 'strong', term: 'summer', status: 'applied', appliedDate: ago(9), statusDate: ago(9), posted: ago(14), url: 'https://example.com/jobs/1009' },
      '1010': { company: 'Aurora Insurance', title: 'Claims Analytics Co-op', location: 'Toronto, ON', score: 66, tier: 'maybe', term: 'summer', status: 'applied', appliedDate: ago(8), statusDate: ago(8), posted: ago(15), url: 'https://example.com/jobs/1010' },
      '1011': { company: 'Redwood Retail', title: 'Merchandising Analyst Co-op', location: 'Toronto, ON', score: 63, tier: 'maybe', term: 'summer', status: 'applied', appliedDate: ago(2), statusDate: ago(2), posted: ago(12), url: 'https://example.com/jobs/1011' },
      '1012': { company: 'Silverline Bank', title: 'Treasury Analyst Intern', location: 'Toronto, ON', score: 74, tier: 'strong', term: 'summer', status: 'interview', appliedDate: ago(12), statusDate: ago(3), posted: ago(20), url: 'https://example.com/jobs/1012' },
      '1013': { company: 'Orchard Tech', title: 'Product Analyst Intern', location: 'Toronto, ON', score: 55, tier: 'maybe', term: 'summer', status: 'rejected', appliedDate: ago(18), statusDate: ago(5), posted: ago(25), url: 'https://example.com/jobs/1013' },
      '1014': { company: 'Cobalt Energy', title: 'Operations Analyst Co-op', location: 'Oakville, ON', score: 60, tier: 'maybe', term: 'summer', status: 'unavailable', statusDate: ago(4), posted: ago(21), url: 'https://example.com/jobs/1014' },
      '1015': { company: 'Eastgate Group', title: 'Senior Financial Analyst', location: 'Toronto, ON', score: 18, tier: 'rejected', term: 'unknown', status: 'hidden', posted: ago(1), url: 'https://example.com/jobs/1015', flags: 'Full-time' },
      '1016': { company: 'Willow Logistics', title: 'Data Analyst Co-op', location: 'Toronto, ON', score: 47, tier: 'maybe', term: 'summer', status: 'new', firstSeen: hrs(20), posted: ago(0), url: 'https://example.com/jobs/1016', source: 'Eluta' }
    },
    events: {
      'northwind-info-session': { company: 'Northwind Bank', title: 'Campus info session: analytics co-ops', type: 'info session', date: ahead(5), time: '5:00 PM', location: 'Virtual', url: 'https://example.com/events/1', registration: 'open', registerBy: ahead(3), spots: '40 spots left', checked: ago(0), cost: 'Free', costNote: 'Open to all students', meet: [{ name: 'Alex Morgan', title: 'Campus recruiter', company: 'Northwind Bank', url: 'https://example.com/in/alex' }], employers: [], whyGo: 'Recruiters for the Summer 2027 analyst roles answer questions live', status: 'going' },
      'career-fair': { company: 'City Career Fair', title: 'Business and analytics career fair', type: 'career fair', date: ahead(12), time: '10:00 AM to 3:00 PM', location: 'Toronto, ON', url: 'https://example.com/events/2', registration: 'open', registerBy: ahead(9), spots: null, checked: ago(0), cost: '$15', costNote: 'Student price', meet: [], employers: ['Northwind Bank', 'Maple Mutual', 'Summit Wealth', 'Cedar Analytics', 'Granite Advisory'], whyGo: 'Five employers from your target list in one room', status: 'new' },
      'maple-coffee-chat': { company: 'Maple Mutual Insurance', title: 'Coffee chat: risk and actuarial teams', type: 'coffee chat', date: ahead(2), time: '3:00 PM', location: 'Virtual', url: 'https://example.com/events/3', registration: 'waitlist', registerBy: null, spots: 'Waitlist only', checked: ago(0), cost: 'Free', costNote: null, meet: [{ name: 'Priya Shah', title: 'Risk analyst', company: 'Maple Mutual Insurance', url: null }], employers: [], whyGo: 'Hear how analysts there got their first co-op', status: 'new' },
      'resume-workshop': { company: 'School Career Services', title: 'Resume and ATS workshop', type: 'workshop', date: ahead(8), time: '12:00 PM', location: 'Campus', url: 'https://example.com/events/4', registration: 'none', registerBy: null, spots: null, checked: ago(1), cost: 'Free', costNote: 'Free for students', meet: [], employers: [], whyGo: 'Walk-in review of your one-page resume', status: 'new' },
      'old-panel': { company: 'Granite Advisory', title: 'Consulting panel night', type: 'panel', date: ago(6), time: '6:00 PM', location: 'Toronto, ON', url: 'https://example.com/events/5', registration: 'closed', registerBy: null, spots: null, checked: ago(7), cost: 'Free', meet: [], employers: [], whyGo: '', status: 'new' }
    },
    trends: {
      summer: {
        updated: ago(1),
        headline: 'Analyst co-ops at banks and insurers are posting for May again. Data, risk and reporting titles outnumber strategy roles two to one.',
        seek: ['Apply within three days of a posting: most close in two weeks.', 'Lead with SQL and Excel proof, since most postings name them.', 'Target risk, reporting and operations titles, not only finance.', 'Book two employer events a week.'],
        employers: [{ name: 'Northwind Bank', summer: 6, other: 2 }, { name: 'Maple Mutual', summer: 4, other: 3 }, { name: 'Silverline Bank', summer: 4, other: 1 }, { name: 'Summit Wealth', summer: 3, other: 2 }, { name: 'Cedar Analytics', summer: 2, other: 1 }],
        history: [{ name: 'Northwind Bank', y25: 4, y26: 6 }, { name: 'Maple Mutual', y25: 3, y26: 4 }, { name: 'Silverline Bank', y25: 2, y26: 4 }],
        skills: [{ name: 'Excel', n: 11 }, { name: 'SQL', n: 9 }, { name: 'Power BI', n: 7 }, { name: 'Python', n: 6 }, { name: 'Tableau', n: 5 }, { name: 'Forecasting', n: 4 }],
        skillBase: 12
      }
    }
  };

  function overrides() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function saveOverrides(o) { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) { /* private mode: changes last until reload */ } }
  var ov = overrides(), listeners = [];

  function data(path) {
    var p = path.split('/'), base = (SEED[p[0]] || {})[p[1]];
    if (!base) return null;
    return Object.assign({}, base, ov[path] || {});
  }
  function emit() { listeners.forEach(function (f) { f(); }); }

  window.demoDb = function () {
    return Promise.resolve({
      collection: function (name) {
        return { onSnapshot: function (cb) {
          var run = function () { cb({ docs: Object.keys(SEED[name] || {}).map(function (id) { return { id: id, data: function () { return data(name + '/' + id); } }; }) }); };
          listeners.push(run); run();
        } };
      },
      doc: function (path) {
        return {
          onSnapshot: function (cb) {
            var run = function () { var d = data(path); cb({ exists: !!d, data: function () { return d; } }); };
            listeners.push(run); run();
          },
          update: function (fields) { ov[path] = Object.assign(ov[path] || {}, fields); saveOverrides(ov); emit(); return Promise.resolve(); }
        };
      }
    });
  };
})();
