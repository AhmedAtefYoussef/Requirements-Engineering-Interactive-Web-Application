RE.register({
  id: 'l2', num: 2,
  title: 'Elicitation',
  short: 'Elicitation',
  slides: 36,
  lede: 'Elicitation is how analysts discover what stakeholders really need. This lecture covers planning a session, sorting the messy input you get back, the eight techniques with their trade-offs, and what a well-formed requirement looks like.',
  outcomes: [
    'Define elicitation and plan it: objective, techniques, schedule, documents and risks',
    'Run a session in three stages: before, during and after',
    'Classify raw customer input into business requirements, user requirements, business rules, functional requirements and more',
    'Choose between the eight elicitation techniques using benefits, limits and when to avoid each',
    'Write requirements that meet the SMART characteristics'
  ],
  sections: [
    {
      id: 'what-is-elicitation',
      title: 'What elicitation is, and what to elicit',
      html: `<p><span class="term">Elicitation</span> is the practice of researching and discovering the requirements of a system from different sources: users, customers, domain experts, other stakeholders, documentation, and examination of existing systems. The slide equates it with "gathering", but books warn that it is more than transcription. It is a collaborative and analytical activity: you collect, discover, extract and define.</p>
<p>The slide says to elicit three kinds of thing:</p>
<ul>
<li><strong>Needs</strong>: what the users and business must be able to do or achieve.</li>
<li><strong>Constraints</strong>: limits on the solution, such as number of users, functions or features.</li>
<li><strong>Time and cost</strong>: how long the work can take and what it may cost.</li>
</ul>
<p>Why is it hard? Stakeholders often do not know what they want, use their own jargon, conflict with each other, are influenced by politics, and the business environment keeps changing.</p>
<aside class="example"><p><strong>Maria and Phil.</strong> Phil, a business analyst, asks Maria (the product champion for a new employee information system) "what do you want?". She answers in a scatter of remarks: the system should be much faster; it should accept very long names without crashing; a new law forbids using Social Security numbers as employee IDs; and she would like a report of training hours per employee this year. Phil writes everything down but is lost: the desires are scattered, he cannot tell if they match the project's business objectives, and he does not know what to ask next.</p></aside>
<p>The lesson: Phil's open question got him random information. He needs a <strong>plan</strong> and a way to <strong>classify</strong> what he hears. Both come next.</p>
<aside class="pitfall">"What do you want?" invites a wish list. Better: "What do you need to do?" Focus on user tasks and true needs, and ask "why" to move from a proposed solution to the real need.</aside>`,
      visual: null,
      takeaways: [
        'Elicitation discovers requirements from people, documents and existing systems; it is more than note taking.',
        'Elicit needs, constraints, and time and cost.',
        'Maria and Phil show that unplanned, unclassified input leaves the analyst lost.'
      ],
      source: 'Lecture 2, slides 3-7 · Wiegers ch.7 · Sommerville ch.4.5'
    },
    {
      id: 'planning-elicitation',
      title: 'Planning elicitation',
      html: `<p>Plan elicitation before you start talking to people. The lecture gives five plan items:</p>
<table class="tbl">
<thead><tr><th>Plan item</th><th>Question it answers</th><th>Example for the employee system</th></tr></thead>
<tbody>
<tr><td><strong>Elicitation objective</strong></td><td>What are we trying to learn?</td><td>Understand HR staff tasks and reporting needs</td></tr>
<tr><td><strong>Planned techniques</strong></td><td>How will we learn it, for which group?</td><td>Interview Maria; workshop with HR; analyze the old system\'s screens</td></tr>
<tr><td><strong>Schedule</strong></td><td>When, how long, and how much analyst time (including preparation and follow-up)?</td><td>Two 60-minute interviews in week 1</td></tr>
<tr><td><strong>Documents needed</strong></td><td>Which documents or systems must we read first?</td><td>Old system user manual, the new law</td></tr>
<tr><td><strong>Elicitation risks</strong></td><td>What could go wrong and what do we do?</td><td>Maria unavailable: arrange a backup user; vague answers: prepare straw man models</td></tr>
</tbody></table>
<p>Choose techniques to match the project. A new internal application typically combines stakeholder interviews, workshops and system interface analysis. A mass-market product with no easy access to users leans on focus groups. Never rely on a single technique: facilitated ones (interviews, workshops, observation) mostly reveal business and user needs, while independent ones (documents, interfaces) reveal functionality users forget to mention.</p>
<aside class="pitfall">Typical plan failure: listing techniques without a schedule or risk. All five items belong in the plan, and risks need a mitigation, not just a name.</aside>`,
      visual: 'elicit-plan',
      takeaways: [
        'A plan states objective, planned techniques, schedule, documents needed, and risks.',
        'Match techniques to the project and combine facilitated with independent ones.',
        'Include preparation and follow-up time in the schedule, and a mitigation for each risk.'
      ],
      source: 'Lecture 2, slides 7-8 · Wiegers ch.7 (Fig 7-3)'
    },
    {
      id: 'session-activities',
      title: 'Before, during and after a session',
      html: `<p>The slide "Activities for a single requirement elicitation session" groups the work into three stages.</p>
<p><strong>Before the session (prepare)</strong></p>
<ul>
<li>Plan the scope and agenda, and share it in advance.</li>
<li>Arrange resources: room, documents, tools, access to systems.</li>
<li>Learn about the stakeholders (role, language, culture).</li>
<li>Prepare <strong>open-ended, non-leading questions</strong>, with probes for exceptions ("what happens when...?").</li>
<li>Prepare <strong>straw man models</strong>: draft use cases or process flows you expect to be partly wrong, which gives people something to react to.</li>
</ul>
<p><strong>During the session</strong></p>
<ul>
<li>Explain how the technique works so people know what to expect.</li>
<li>Take good notes (ideally a dedicated scribe): attendees, decisions, actions with owners, open issues.</li>
<li>Use a parking lot for off-topic items, timebox discussions, keep to the agenda and scope.</li>
</ul>
<p><strong>After the session</strong></p>
<ul>
<li>Organize and share the notes quickly so the source can confirm them; keep the raw notes.</li>
<li>Record open issues with an owner and due date, and empty the parking lot.</li>
<li>Classify the information gathered (next section).</li>
</ul>
<aside class="example"><p>Phil prepares for his next meeting with Maria: an agenda (slow screens, name handling, ID change, training report), questions such as "What three things annoy you most about the current system?", and a straw man screen for the training-hours report. He ends with "Is there anything else you expected me to ask?"</p></aside>
<aside class="pitfall">Waiting a week to send notes. The longer you wait, the less likely the stakeholder remembers what they meant. Notes shared promptly are the only way the source can correct you.</aside>`,
      visual: null,
      takeaways: [
        'Before: scope, resources, stakeholders, questions and straw man models.',
        'During: educate, scribe, parking lot, timebox.',
        'After: share notes fast, log open issues, classify the information.'
      ],
      source: 'Lecture 2, slide 8 · Wiegers ch.7'
    },
    {
      id: 'classifying-input',
      title: 'Classifying input, and when you are done',
      html: `<p>Customers do not speak in neat requirement statements. Your job after a session is to <strong>classify</strong> what you heard, because each category is handled differently. The lecture shows four main categories with examples:</p>
<table class="tbl">
<thead><tr><th>Category</th><th>What it is</th><th>Example from the slides</th></tr></thead>
<tbody>
<tr><td><strong>Business requirement</strong></td><td>Financial or business benefit; the "why" for the organization</td><td>Increase market share in region X by Y percent within Z months</td></tr>
<tr><td><strong>User requirement</strong></td><td>A goal or task the user needs to do</td><td>I need to print a mailing label for a package</td></tr>
<tr><td><strong>Business rule</strong></td><td>A policy or regulation; not itself software, but the source of requirements</td><td>A new client must pay 30 percent of the estimated fee and expenses in advance</td></tr>
<tr><td><strong>Functional requirement</strong></td><td>Observable system behavior</td><td>The user must be able to sort the project list in forward and reverse alphabetical order</td></tr>
</tbody></table>
<p>Wiegers adds more: <strong>quality attributes</strong> ("fast", "easy", "reliable", which must be made measurable), <strong>external interface</strong> requirements, <strong>constraints</strong> ("must be written in..."; ask why and record the rationale), <strong>data</strong> requirements, and <strong>solution ideas</strong> ("choose from a drop-down list": probe for the real need).</p>
<aside class="example"><p>Maria\'s four remarks: "much faster than the old one" is a <strong>quality attribute</strong> (performance) needing a metric. "Take long names without crashing" is a <strong>quality attribute</strong> (robustness) and a <strong>data requirement</strong> (name length). "A new law says we can't use Social Security numbers as IDs" is a <strong>business rule</strong> leading to functional and data requirements. "A report of training hours per employee" is a <strong>user/functional requirement</strong>.</p></aside>
<aside class="pitfall">Cue words help: "must comply with" suggests a business rule, "I need to..." a user requirement, "fast" or "easy" a quality attribute, "must be written in" a constraint. But cues are hints, not proof; check the meaning.</aside>
<p><strong>How do you know when you are done?</strong> There is no perfect signal and you are never entirely done, especially in agile projects. Look for diminishing returns: users cannot think of more use cases, new scenarios add no new functional requirements, users repeat earlier points, new suggestions are out of scope or low priority, and developers and testers raise few questions on review. The aim is a shared understanding good enough to build the next increment at acceptable risk.</p>
<aside class="pitfall">"We are done when the document is long enough" is wrong. Completion is judged by what new information keeps arriving, not by page count.</aside>`,
      visual: 'input-classifier',
      takeaways: [
        'Sort raw input into business requirements, user requirements, business rules, FRs, quality attributes, constraints, interfaces, data and solution ideas.',
        'A business rule is a source of requirements, not a software requirement itself.',
        'Done means diminishing returns: repetition, out-of-scope or low-priority ideas, few new questions.'
      ],
      source: 'Lecture 2, slides 9-14 · Wiegers ch.7 (Fig 7-7)'
    },
    {
      id: 'interviews-workshops',
      title: 'Interviews and workshops',
      html: `<p><strong>Interviews</strong> are the traditional technique and the easiest to schedule. They suit domain newcomers, executives (for business requirements), touchy topics, and building rapport. Typical questions cover: what the system is and which problem it solves, the goals, daily use, how the work is done now (frequency, volume), constraints and performance needs.</p>
<p>The slide gives five tips: <strong>establish rapport</strong>, <strong>prepare questions</strong>, <strong>prepare straw man models</strong>, <strong>suggest ideas</strong> (users may not know what is possible), and <strong>listen actively</strong> while <strong>staying in scope</strong>.</p>
<p><em>What are the interview mistakes?</em> The slide leaves this open as a discussion. The common ones are: asking only closed or leading questions, asking "what do you want?" instead of "what do you do?", talking more than listening, recording solutions instead of needs, going out of scope, no follow-up on exceptions, interviewing one person and nothing else, and not sharing notes afterwards. Interviews are weak for domain knowledge (it is so familiar that people forget to say it) and for organizational or political requirements.</p>
<p><strong>Workshops</strong> are facilitated sessions with multiple stakeholders and formal roles: users, developers, testers and others. They are resource intensive, must be planned well, and are rarely useful starting from a blank slate, so use other methods first. They help resolve disagreement and give quick turnaround.</p>
<p><strong>Ground rules:</strong> keep the team small with the right stakeholders; fill all the roles; plan an agenda; stay in scope; timebox discussions; use parking lots; keep everyone engaged; establish and enforce the rules. Six roles appear on the slide:</p>
<table class="tbl">
<thead><tr><th>Role</th><th>Job</th></tr></thead>
<tbody>
<tr><td>Facilitator</td><td>Plans and guides the session; stays neutral</td></tr>
<tr><td>Timekeeper</td><td>Watches the clock and keeps to the timebox</td></tr>
<tr><td>Focus maker</td><td>Pulls the group back to the topic and scope</td></tr>
<tr><td>Observer</td><td>Watches group dynamics and body language and gives feedback</td></tr>
<tr><td>Agitator</td><td>Challenges ideas to provoke deeper thought and surface hidden assumptions</td></tr>
<tr><td>Note taker</td><td>Records decisions, actions and open issues</td></tr>
</tbody></table>
<aside class="note">The slide names the roles without definitions; the descriptions above are the natural reading. Wiegers also names the scribe, scope manager and ground-rule manager. Learn the six on your slide.</aside>
<aside class="pitfall">Too many people. Twelve participants slow a workshop; around five or six active ones works better. Another trap: the facilitator also trying to scribe and take part. Split roles.</aside>`,
      visual: 'workshop-roles',
      takeaways: [
        'Interviews: easy and good for rapport, but weak on tacit domain knowledge and politics.',
        'Workshops: multiple stakeholders with formal roles; plan well, keep small, use ground rules and parking lots.',
        'Know the six roles: facilitator, timekeeper, focus maker, observer, agitator, note taker.'
      ],
      source: 'Lecture 2, slides 17-20 · Wiegers ch.7 · Sommerville ch.4.5.2'
    },
    {
      id: 'focus-observation-questionnaires',
      title: 'Focus groups, observation and questionnaires',
      html: `<p><strong>Focus groups.</strong> A representative group of users meets in a facilitated session to generate input and ideas on a product\'s functional and quality requirements. They explore users\' attitudes, impressions, preferences and needs, and are especially valuable for commercial products when you cannot easily reach end users inside your company. Output is qualitative opinion. Participants normally have no decision authority, which is the key contrast with a workshop.</p>
<p><strong>Observation.</strong> Watch users do their work. Some tasks are harder to describe than to do, and habitual tasks are skipped in interviews (try describing how you tie your shoes). Observation is time consuming, so reserve it for important or high-risk tasks. Two styles:</p>
<ul>
<li><strong>Silent</strong>: you watch and take notes without interrupting.</li>
<li><strong>Interactive</strong>: you ask questions during the task.</li>
</ul>
<p><strong>Questionnaires.</strong> Survey large groups of users to understand their needs. They are inexpensive, easy to administer across geographical boundaries, and their analyzed results feed other techniques. The biggest challenge is preparing well-written questions.</p>
<p><em>Considerations for a good questionnaire:</em> make options <strong>mutually exclusive</strong> and <strong>exhaustive</strong> (or allow write-in), do not lead respondents toward an answer, use scales consistently, prefer closed questions for statistical analysis, keep it short, and <strong>always pilot-test</strong> it.</p>
<aside class="example"><p>Flawed question: "How old are you? 18-30 / 30-40 / 40-50". A 30-year-old fits two options (not mutually exclusive) and a 55-year-old fits none (not exhaustive). Fixed: 18-29 / 30-39 / 40-49 / 50 or over.</p></aside>
<aside class="pitfall">Leading question: "Don\'t you agree the new design is great?" pushes the answer. Rephrase neutrally: "How would you rate the new design?"</aside>`,
      visual: null,
      takeaways: [
        'Focus groups explore opinions of representative users; participants do not make decisions.',
        'Observation (silent or interactive) captures habitual work users cannot articulate; it is slow, so target high-risk tasks.',
        'Questionnaires scale cheaply; options must be mutually exclusive and exhaustive, and the form must be piloted.'
      ],
      source: 'Lecture 2, slides 21-24 · Wiegers ch.7'
    },
    {
      id: 'independent-techniques',
      title: 'System interface, UI and document analysis',
      html: `<p>These three are <strong>independent</strong> techniques: you do much of the work without stakeholders in the room, and they uncover functionality users might never think to mention.</p>
<table class="tbl">
<thead><tr><th>Technique</th><th>What you examine</th><th>What it reveals</th><th>Watch out for</th></tr></thead>
<tbody>
<tr><td><strong>System interface analysis</strong></td><td>The systems your system connects to</td><td>Functional requirements for data and service exchange: what to send, what is received, rules about the data</td><td>An interface missing from the context diagram means the diagram is incomplete</td></tr>
<tr><td><strong>User interface analysis</strong></td><td>Existing or similar systems (interact directly, use screenshots)</td><td>User and functional requirements; helps draft use cases to review with users</td><td>Do not assume the same functionality or flow is needed in the new system</td></tr>
<tr><td><strong>Document analysis</strong></td><td>SRSs, user manuals, development documents, standards, regulations, comparative reviews</td><td>Compliance rules and information people do not tell you; builds competitive advantage</td><td>Documents may be outdated or poorly written</td></tr>
</tbody></table>
<aside class="example"><p>Maria\'s company replaces its employee system. Document analysis of the old user manual and the new law shows the ID change; user interface analysis of the old screens finds a report no one mentioned; system interface analysis of the payroll link shows which employee data must be exported.</p></aside>
<aside class="pitfall">Copying the old system. UI analysis is for discovering needs, not cloning flows. The old system may contain workarounds the new one should remove.</aside>`,
      visual: null,
      takeaways: [
        'Interface, UI and document analysis work without stakeholders and surface forgotten needs.',
        'System interface analysis finds data-exchange requirements; UI analysis finds user and functional requirements.',
        'Risks: outdated documents and wrongly copying old flows.'
      ],
      source: 'Lecture 2, slides 25-27 · Wiegers ch.7'
    },
    {
      id: 'choosing-ethnography-usecases',
      title: 'Choosing a technique, ethnography and use cases',
      html: `<p>No technique is best everywhere. Choosing means comparing key benefits, limits and when to avoid each. The slide asks you to compare them using factors such as key benefits, advantages and disadvantages. Use the matrix below, then the table of one-line guidance.</p>
<table class="tbl">
<thead><tr><th>Technique</th><th>Key benefit</th><th>When to avoid</th></tr></thead>
<tbody>
<tr><td>Questionnaires and surveys</td><td>Cheap, reach many users across locations</td><td>You need depth or the questions cannot be well formed</td></tr>
<tr><td>Interviews</td><td>Rapport, easy to schedule, sensitive topics</td><td>Tacit domain knowledge or politics; only one person is consulted</td></tr>
<tr><td>Focus groups and workshops</td><td>Group input; workshops resolve conflicts and decide</td><td>Tight budget or weak planning; no representative users</td></tr>
<tr><td>Document, UI and system interface analysis</td><td>Finds forgotten needs without users</td><td>Documents or old systems are outdated or irrelevant</td></tr>
<tr><td>Observation</td><td>Reveals real habits users cannot describe</td><td>Little time, or low-risk tasks</td></tr>
</tbody></table>
<p><strong>Ethnography</strong> is a prolonged form of observation in which the analyst immerses in the work environment and notes how people actually work. It finds <strong>implicit requirements</strong> that people cannot articulate because the work is second nature, and the social and organizational context. Two kinds emerge: requirements from <em>actual practice</em> rather than formal process, and from <em>cooperation and awareness</em> of other people\'s activities. Example: air traffic controllers deliberately switch off the conflict alert, and rely on seeing neighbouring sectors\' workload. Limits: it focuses on end users, misses organizational and domain requirements and new ideas, so combine it with other methods.</p>
<p>The lecture also teases <strong>use case diagrams</strong>: a picture of actors and the goals they achieve with the system. They are used when you want to show who uses the system and what for, and they are covered in the next lecture.</p>
<aside class="pitfall">Observation (short, task-focused, roughly two hours) is not ethnography (extended immersion in social context). Both beat interviews for habitual or tacit work.</aside>`,
      visual: 'technique-matrix',
      takeaways: [
        'Choose techniques by benefit and fit, and combine them; never rely on one.',
        'Ethnography finds implicit requirements from real practice and cooperation; it is weak on organizational and new needs.',
        'Use case diagrams show actors and their goals (next lecture).'
      ],
      source: 'Lecture 2, slides 28-34 · Sommerville ch.4.5.5 · Wiegers ch.7 · Practice Assignment 2'
    },
    {
      id: 'smart-quality',
      title: 'SMART and good-requirement traits',
      html: `<p>After gathering, ask: what are the characteristics of your gathered requirements? The slide offers the <span class="term">SMART</span> checklist:</p>
<table class="tbl">
<thead><tr><th>Letter</th><th>Meaning</th><th>Test question</th></tr></thead>
<tbody>
<tr><td><strong>S</strong>pecific</td><td>Clear, one meaning</td><td>Could two people read it differently?</td></tr>
<tr><td><strong>M</strong>easurable</td><td>Has a metric or test</td><td>How would we check it is met?</td></tr>
<tr><td><strong>A</strong>greed upon</td><td>Stakeholders accept it</td><td>Who approved it?</td></tr>
<tr><td><strong>R</strong>ealistic</td><td>Achievable with the available time, budget and technology</td><td>Can we build it?</td></tr>
<tr><td><strong>T</strong>ime-based</td><td>Has a deadline or time frame</td><td>By when or how fast?</td></tr>
</tbody></table>
<aside class="example"><p>Vague: "The app should load quickly."<br>SMART: "On a 4G connection, the home screen shall display within 2 seconds for 95 percent of launches (measured in release 1 acceptance tests, agreed with the product owner)."</p></aside>
<p>Wiegers\' complementary list for individual requirements: complete, correct, feasible, necessary, prioritized, unambiguous, <strong>verifiable</strong>. For the whole set: complete, consistent, modifiable, traceable. Close matches: measurable is roughly verifiable, realistic is roughly feasible, agreed is roughly necessary and prioritized. Practical template: [condition] [trigger] the system shall [response]. Use "shall", not "should".</p>
<aside class="pitfall">Adding a number does not guarantee quality. "The system shall handle 1,000,000 users in 1 second on one phone" is measurable but not realistic. Check all five letters.</aside>`,
      visual: 'smart-builder',
      takeaways: [
        'SMART: Specific, Measurable, Agreed upon, Realistic, Time-based.',
        'Every vague adjective ("fast", "easy") must be replaced with a measurable, bounded statement.',
        'Wiegers adds verifiable, feasible, necessary, unambiguous and, for the set, consistent and traceable.'
      ],
      source: 'Lecture 2, slides 32-33 · Wiegers ch.11'
    }
  ],
  practice: [
    {
      id: 'pa2-elicitation',
      title: 'Practice Assignment 2: compare techniques and choose for five clients',
      source: 'Practice Assignment 2',
      prompt: `<p><strong>Question 1.</strong> Compare the elicitation techniques: questionnaires and surveys, interviews, focus groups and workshops, analyzing documentation (plus UI and system interface), and observation. For each, give the key benefit and when to avoid it.</p>
<p><strong>Question 2.</strong> Pick the best elicitation technique for each client, justify it, then write at least three requirements (functional and non-functional) that follow the SMART principle.</p>
<ul>
<li><strong>A.</strong> A party sync feature for a music streaming app.</li>
<li><strong>B.</strong> Your own startup providing online food delivery.</li>
<li><strong>C.</strong> New software for movie editing and VFX.</li>
<li><strong>D.</strong> A governmental application to digitize the citizens database.</li>
<li><strong>E.</strong> A study group feature in an online course website.</li>
</ul>
<p>Try each yourself before revealing. These are model answers; other technique choices are fine if justified.</p>`,
      visual: null,
      steps: [
        { q: 'Q1: complete the comparison table (key benefit and when to avoid).', a: `<table class="tbl"><thead><tr><th>Technique</th><th>Key benefit</th><th>When to avoid</th></tr></thead><tbody>
<tr><td>Questionnaire and surveys</td><td>Inexpensive; reach large, dispersed groups; results feed other techniques</td><td>When you need depth or explanations, or cannot write good unambiguous questions</td></tr>
<tr><td>Interviews</td><td>Build rapport, easy to schedule, good for executives and sensitive topics, can follow up</td><td>As the only source for tacit domain knowledge or organizational politics</td></tr>
<tr><td>Focus groups and workshops</td><td>Many viewpoints at once; workshops resolve conflicts and produce agreed deliverables</td><td>When the budget or planning is thin, no representative users are available, or starting from a blank slate</td></tr>
<tr><td>Analyzing documentation, UI and SI</td><td>Finds forgotten functionality and compliance rules without stakeholders</td><td>When documents or legacy systems are outdated, or there is no similar system</td></tr>
<tr><td>Observation</td><td>Shows real habits users cannot describe</td><td>When time is short, tasks are low risk, or watching changes behavior or is not permitted</td></tr></tbody></table>` },
        { q: 'A. Party sync for a music app: technique, justification and three SMART requirements.', a: `<p><strong>Technique:</strong> questionnaire plus focus groups. <strong>Why:</strong> a mass-market consumer feature; users are numerous, dispersed and not reachable individually. A survey finds how people listen together, and a focus group explores attitudes and preferences.</p>
<ul>
<li><strong>FR:</strong> A host shall be able to invite up to 10 friends to a party session via a shared link, and all members shall hear the same track in the same session.</li>
<li><strong>NFR (performance):</strong> Playback shall stay synchronized within 300 ms for 95 percent of listeners on a 4G connection.</li>
<li><strong>NFR (availability):</strong> The party feature shall have 99.5 percent monthly uptime, measured from release.</li>
</ul>` },
        { q: 'B. Online food delivery startup: technique, justification and three SMART requirements.', a: `<p><strong>Technique:</strong> interviews with restaurant owners and couriers, plus a customer questionnaire and UI analysis of competitor apps. <strong>Why:</strong> a new business with no legacy system; interviews give depth from a few key stakeholders, the survey reaches many customers, and competitors\' apps reveal expected features.</p>
<ul>
<li><strong>FR:</strong> A customer shall be able to place an order, pay online, and see live order status from restaurant acceptance to delivery.</li>
<li><strong>NFR (performance):</strong> The menu page shall load within 2 seconds for 95 percent of requests during peak hours (12:00-14:00).</li>
<li><strong>NFR (reliability):</strong> Payment shall succeed or fail with a clear message, and failed charges shall be refunded within 24 hours.</li>
</ul>` },
        { q: 'C. Movie editing and VFX software: technique, justification and three SMART requirements.', a: `<p><strong>Technique:</strong> observation (including ethnography) of professional editors, backed by interviews. <strong>Why:</strong> experts work with complex habitual workflows (timelines, shortcuts, rendering) that they cannot fully describe; watching reveals pain points and implicit practice.</p>
<ul>
<li><strong>FR:</strong> The editor shall allow cutting, trimming and layering at least 20 video tracks on one timeline, with undo of the last 50 actions.</li>
<li><strong>NFR (performance):</strong> Preview of a 4K clip with 3 effects shall play at 24 fps or higher on the reference workstation.</li>
<li><strong>NFR (reliability / recoverability):</strong> Projects shall auto-save every 2 minutes, and after a crash at most 2 minutes of work shall be lost.</li>
</ul>` },
        { q: 'D. Government citizen database digitization: technique, justification and three SMART requirements.', a: `<p><strong>Technique:</strong> document analysis (laws, existing forms and records, standards) plus workshops with agencies and interviews with officials. <strong>Why:</strong> heavy regulation and existing paper processes; documents hold the compliance rules, and workshops resolve differences among agencies.</p>
<ul>
<li><strong>FR:</strong> An authorized clerk shall be able to search a citizen record by national ID and update address fields, with each change logged with user and time.</li>
<li><strong>NFR (security / external):</strong> The system shall encrypt personal data at rest and in transit and comply with the national data-protection law, verified by an audit before go-live.</li>
<li><strong>NFR (scalability / availability):</strong> The system shall support 5,000 concurrent clerks and 99.9 percent availability during working hours (08:00-16:00).</li>
</ul>` },
        { q: 'E. Study group feature on an online course site: technique, justification and three SMART requirements.', a: `<p><strong>Technique:</strong> questionnaire to enrolled students and short interviews with a few students and instructors (user interface analysis of similar tools optionally). <strong>Why:</strong> a bounded add-on for an existing user base; a survey gives breadth cheaply and interviews explain the findings.</p>
<ul>
<li><strong>FR:</strong> A student shall be able to create or join a study group of up to 8 members for a course and post messages and files in it.</li>
<li><strong>NFR (usability):</strong> 90 percent of new users shall be able to create a group within 2 minutes without help, in usability testing before release.</li>
<li><strong>NFR (privacy / external):</strong> Group content shall be visible only to its members, and student names shall follow the platform\'s privacy policy.</li>
</ul>` }
      ]
    }
  ],
  flashcards: [
    { id: 'l2-f01', front: 'Define elicitation.', back: 'Researching and discovering the requirements of a system from users, customers, domain experts, other stakeholders, documentation and existing systems. It is collaborative and analytical, not mere note taking.', tag: 'definition' },
    { id: 'l2-f02', front: 'What three things does elicitation gather?', back: 'Needs, constraints (such as number of users, functions, features), and time and cost.', tag: 'definition' },
    { id: 'l2-f03', front: 'Why did Phil struggle in the Maria and Phil story?', back: 'He asked an open "what do you want?" question, got scattered remarks, could not tell if they matched business objectives, and did not know how to organize them or what to ask next.', tag: 'example' },
    { id: 'l2-f04', front: 'Name the five items of an elicitation plan.', back: 'Elicitation objective, planned techniques, schedule, documents needed, and elicitation risks.', tag: 'definition' },
    { id: 'l2-f05', front: 'What should be prepared before an elicitation session?', back: 'Scope and agenda, resources, knowledge of stakeholders, open-ended non-leading questions, and straw man models.', tag: 'definition' },
    { id: 'l2-f06', front: 'What is a straw man model?', back: 'A draft model (such as a use case or process flow) prepared in advance and expected to be partly wrong, so stakeholders react and correct it.', tag: 'definition' },
    { id: 'l2-f07', front: 'What happens after an elicitation session?', back: 'Organize and share notes quickly for confirmation, log open issues with owner and due date, empty the parking lot, and classify the information.', tag: 'definition' },
    { id: 'l2-f08', front: 'Classify: "Increase market share in region X by Y percent within Z months."', back: 'Business requirement. It states a financial or market benefit for the organization, the why behind the system.', tag: 'apply' },
    { id: 'l2-f09', front: 'Classify: "I need to print a mailing label for a package."', back: 'User requirement. It states a goal or task the user needs to perform, and typically starts with "I need to".', tag: 'apply' },
    { id: 'l2-f10', front: 'Classify: "A new client must pay 30 percent of the fee in advance."', back: 'Business rule: a policy that defines or constrains the business. It is not itself software but yields functional requirements to enforce it.', tag: 'apply' },
    { id: 'l2-f11', front: 'Classify: "The user must be able to sort the project list alphabetically, forward and reverse."', back: 'Functional requirement: observable system behavior that a developer can implement and a tester can verify.', tag: 'apply' },
    { id: 'l2-f12', front: 'Why is a "solution idea" in customer input risky?', back: 'A user saying "use a drop-down list" gives a design, not a need. Ask why to find the true requirement; keep the design only if justified.', tag: 'definition' },
    { id: 'l2-f13', front: 'How do you know when elicitation is done?', back: 'There is no clear signal. Look for diminishing returns: repeated issues, new ideas out of scope or low priority, no new FRs from scenarios, few reviewer questions.', tag: 'definition' },
    { id: 'l2-f14', front: 'List the five interview tips from the slide.', back: 'Establish rapport, prepare questions, prepare straw man models, suggest ideas, listen actively and stay in scope.', tag: 'definition' },
    { id: 'l2-f15', front: 'Interviews: strengths and weaknesses?', back: 'Strong for rapport, easy scheduling, executives and sensitive topics. Weak for tacit domain knowledge and organizational politics, and risky if used alone.', tag: 'compare' },
    { id: 'l2-f16', front: 'Workshop ground rules?', back: 'Small team with the right stakeholders, all roles filled, agenda, stay in scope, timebox, parking lot, keep everyone engaged, enforce rules.', tag: 'definition' },
    { id: 'l2-f17', front: 'Name the six workshop roles.', back: 'Facilitator, timekeeper, focus maker, observer, agitator, note taker.', tag: 'definition' },
    { id: 'l2-f18', front: 'Focus group vs workshop?', back: 'Focus group: representative users give opinions and attitudes, qualitative, no decision power. Workshop: knowledgeable decision-capable people produce agreed deliverables.', tag: 'compare' },
    { id: 'l2-f19', front: 'Silent vs interactive observation?', back: 'Silent: watch and note without interrupting. Interactive: ask questions during the task. Both are time consuming, so use for important or high-risk tasks.', tag: 'compare' },
    { id: 'l2-f20', front: 'Why are questionnaires attractive, and what is their main challenge?', back: 'Inexpensive, easy across geography, and results inform other techniques. The biggest challenge is writing good questions.', tag: 'definition' },
    { id: 'l2-f21', front: 'Good questionnaire design rules?', back: 'Options mutually exclusive and exhaustive, no leading wording, consistent scales, mostly closed questions for analysis, keep it short, pilot-test.', tag: 'definition' },
    { id: 'l2-f22', front: 'What does system interface analysis reveal?', back: 'Functional requirements for exchanging data and services with connected systems: what data to send and receive and the rules about it.', tag: 'definition' },
    { id: 'l2-f23', front: 'User interface analysis: purpose and warning?', back: 'Study existing or similar systems to find user and functional requirements and draft use cases. Do not assume the functionality or flow must be copied.', tag: 'definition' },
    { id: 'l2-f24', front: 'Document analysis: benefit and drawback?', back: 'Reveals compliance rules and information people do not mention, and speeds up learning. Drawback: documents can be outdated or poorly written.', tag: 'compare' },
    { id: 'l2-f25', front: 'What is ethnography and what does it find?', back: 'Immersive observation of work in its social context. It finds implicit requirements from actual practice and from cooperation and awareness of others, which people cannot easily state.', tag: 'definition' },
    { id: 'l2-f26', front: 'Spell out SMART.', back: 'Specific, Measurable, Agreed upon, Realistic, Time-based.', tag: 'definition' },
    { id: 'l2-f27', front: 'Make this SMART: "The site must be fast."', back: 'Example: "The product page shall load within 2 seconds for 95 percent of requests under 500 concurrent users, verified in the release 1 performance test."', tag: 'apply' },
    { id: 'l2-f28', front: 'Which technique for a mass-market app with no access to end users?', back: 'Focus groups (and questionnaires). They represent users and explore preferences when you cannot reach individuals directly.', tag: 'apply' }
  ],
  quiz: [
    { id: 'l2-q01', kind: 'single', level: 'concept', prompt: 'Which best defines elicitation?', options: ['Writing the SRS', 'Discovering requirements from stakeholders, documents and existing systems', 'Testing the finished system', 'Estimating project cost only'], answer: 1, why: 'Elicitation is researching and discovering requirements from multiple sources. Writing the SRS is specification; testing is verification.' },
    { id: 'l2-q02', kind: 'multi', level: 'concept', prompt: 'Select ALL items the slides say elicitation should gather.', options: ['Needs', 'Constraints', 'Time and cost', 'Source code'], answer: [0, 1, 2], why: 'Needs, constraints and time/cost are the three items. Source code is a product of implementation, not elicitation.' },
    { id: 'l2-q03', kind: 'tf', level: 'concept', prompt: 'An elicitation plan includes an objective, planned techniques, schedule, documents needed, and risks.', answer: true, why: 'These are exactly the five plan items from the lecture.' },
    { id: 'l2-q04', kind: 'single', level: 'concept', prompt: 'Which is NOT one of the six workshop roles on the slide?', options: ['Facilitator', 'Agitator', 'Compiler', 'Timekeeper'], answer: 2, why: 'The roles are facilitator, timekeeper, focus maker, observer, agitator and note taker. "Compiler" is not a role.' },
    { id: 'l2-q05', kind: 'single', level: 'concept', prompt: 'Which technique is described as inexpensive and administered easily across geographical boundaries?', options: ['Interviews', 'Questionnaires', 'Ethnography', 'Focus groups'], answer: 1, why: 'Questionnaires survey large, dispersed groups cheaply. Focus groups need people in a facilitated session.' },
    { id: 'l2-q06', kind: 'tf', level: 'concept', prompt: 'Observation can be silent or interactive.', answer: true, why: 'Silent means the analyst does not interrupt; interactive means questions are asked during the task.' },
    { id: 'l2-q07', kind: 'single', level: 'theory', prompt: 'What is the key difference between a focus group and a workshop?', options: ['Focus groups are larger', 'Focus groups gather users\' opinions and preferences without decision power; workshops produce agreed deliverables with decision-capable participants', 'Workshops use questionnaires', 'There is no difference'], answer: 1, why: 'Focus groups give qualitative opinions; workshop participants can decide and produce deliverables. Group size is not the distinction.' },
    { id: 'l2-q08', kind: 'multi', level: 'theory', prompt: 'Select ALL guidelines for a good questionnaire.', options: ['Answer options mutually exclusive', 'Answer options exhaustive', 'Pilot-test the questionnaire', 'Use leading questions to speed up answers'], answer: [0, 1, 2], why: 'Overlap-free, complete options and a pilot test are core advice. Leading questions bias results and must be avoided.' },
    { id: 'l2-q09', kind: 'single', level: 'theory', prompt: 'Why combine several elicitation techniques?', options: ['Single techniques are illegal', 'Each technique misses things the others find, such as tacit knowledge or forgotten interfaces', 'It shortens the project', 'It removes the need for a plan'], answer: 1, why: 'Interviews miss tacit habits, observation is slow, documents may be stale. A mix covers gaps; it does not remove the need to plan.' },
    { id: 'l2-q10', kind: 'single', level: 'theory', prompt: 'What does ethnography primarily discover?', options: ['Implicit requirements from actual work practice and cooperation', 'The cheapest technology', 'Legal requirements from statutes', 'The color scheme'], answer: 0, why: 'Ethnography immerses the analyst in the work setting to reveal what people actually do and how they depend on each other, rather than the formal process.' },
    { id: 'l2-q11', kind: 'tf', level: 'theory', prompt: 'A business rule is a software requirement in its own right.', answer: false, why: 'A business rule is a policy or regulation. It is a source of requirements (functional, data, constraints) but not itself a software requirement.' },
    { id: 'l2-q12', kind: 'single', level: 'theory', prompt: 'Which signal best suggests elicitation is nearly done?', options: ['The SRS reaches 200 pages', 'Users repeat earlier issues and new ideas are low priority or out of scope', 'The first interview ended', 'Developers have many unanswered questions'], answer: 1, why: 'Done is about diminishing returns. Page count is irrelevant, and many developer questions signal gaps remain.' },
    { id: 'l2-q13', kind: 'single', level: 'practice', prompt: 'A product owner says: "A new law means we cannot store full card numbers." Which category is this?', options: ['Business rule', 'User requirement', 'Quality attribute', 'Solution idea'], answer: 0, why: 'It is a legal policy that governs the business, so a business rule. It will lead to functional and data requirements, but the statement itself is not one.' },
    { id: 'l2-q14', kind: 'single', level: 'practice', prompt: 'A user says: "The checkout should be simple enough that new customers do not abandon it." Which category?', options: ['Functional requirement', 'Quality attribute (usability)', 'Business rule', 'Constraint'], answer: 1, why: 'Words like "simple" signal a quality attribute; it needs a measurable form such as time to checkout. It describes how well, not a specific behavior.' },
    { id: 'l2-q15', kind: 'single', level: 'practice', prompt: 'You must understand a legacy system\'s screens before replacing it, but its users are busy. Which technique first?', options: ['Focus group', 'User interface analysis with document analysis', 'Questionnaire to the public', 'Ethnography for six months'], answer: 1, why: 'Interacting with the existing system and reading its manuals needs little user time. Be careful not to assume the new system must repeat the old flows.' },
    { id: 'l2-q16', kind: 'single', level: 'practice', prompt: 'A questionnaire offers age bands "18-30", "30-40", "40-50". What is wrong?', options: ['Too many bands', 'Bands overlap at 30 and 40 and miss under 18 and over 50', 'Nothing', 'It should be an interview'], answer: 1, why: 'Options must be mutually exclusive and exhaustive. A 30-year-old fits two bands; someone aged 55 fits none.' },
    { id: 'l2-q17', kind: 'single', level: 'practice', prompt: 'Which statement is SMART?', options: ['The system shall be user friendly', 'The report shall be generated quickly', 'Generate the monthly cost report within 30 seconds for 95 percent of runs, starting with release 1', 'The system should support many users'], answer: 2, why: 'Only the third is specific, measurable (30 s, 95 percent) and time-bound. The others use vague words and give no way to verify them.' },
    { id: 'l2-q18', kind: 'single', level: 'practice', prompt: 'A new consumer fitness app needs ideas, but the team has no access to potential users inside the company. Which technique suits best?', options: ['Focus groups with representative users', 'Document analysis of the SRS', 'System interface analysis', 'Silent observation of employees'], answer: 0, why: 'Focus groups suit commercial products when end users are not reachable internally. There is no existing SRS, interface or workflow to analyze.' },
    { id: 'l2-q19', kind: 'multi', level: 'practice', prompt: 'A meeting of 14 people has no agenda, runs long, and the facilitator is also writing notes. Select ALL fixes suggested by the lecture.', options: ['Reduce to a small team with the right stakeholders', 'Fill the roles (e.g. separate note taker and timekeeper)', 'Plan an agenda and timebox discussions', 'Skip ground rules to save time'], answer: [0, 1, 2], why: 'Small team, filled roles, an agenda and timeboxes are the workshop ground rules. Skipping ground rules is the opposite of the advice.' },
    { id: 'l2-q20', kind: 'single', level: 'practice', prompt: 'Controllers say they never switch off the conflict alert, but a researcher living in the control room sees them do it regularly. Which technique exposed the gap?', options: ['Questionnaire', 'Ethnography', 'Business rule analysis', 'Interviews'], answer: 1, why: 'Ethnography reveals actual practice versus formal process. Self-reports from interviews or surveys missed the habit.' }
  ],
  glossary: [
    { term: 'Elicitation', def: 'Researching and discovering requirements from users, customers, domain experts, documents and existing systems; collaborative and analytical rather than transcription.', related: ['Elicitation plan'] },
    { term: 'Elicitation plan', def: 'A plan listing the elicitation objective, planned techniques, schedule, documents needed and elicitation risks.', related: ['Elicitation'] },
    { term: 'Product champion', def: 'A user representative who speaks for a user class and supplies requirements to the analyst; Maria in the lecture story.', related: ['Business analyst'] },
    { term: 'Business analyst', def: 'The person who elicits, analyzes and documents requirements, working between stakeholders and developers; Phil in the lecture story.', related: ['Product champion'] },
    { term: 'Straw man model', def: 'A draft model prepared in advance, expected to be partly wrong, to prompt stakeholders to correct and refine it.', related: ['Interview', 'Workshop'] },
    { term: 'Parking lot', def: 'A place (such as a flipchart) to record off-topic items during a session so they are handled later without derailing the discussion.', related: ['Workshop'] },
    { term: 'Business requirement', def: 'A financial, market or business benefit the organization wants, the why behind the project.', related: ['User requirement'] },
    { term: 'User requirement', def: 'A goal or task a user needs to carry out with the system, often phrased "I need to...".', related: ['Business requirement', 'Functional requirement'] },
    { term: 'Business rule', def: 'A policy, guideline or regulation that defines or constrains the business. It is a source of requirements, not a software requirement itself.', related: ['Constraint'] },
    { term: 'Functional requirement', def: 'A statement of observable system behavior under stated conditions that can be implemented and tested.', related: ['User requirement', 'Quality attribute'] },
    { term: 'Quality attribute', def: 'A requirement about how well the system works, such as speed, usability or reliability; must be made measurable.', related: ['Functional requirement'] },
    { term: 'Constraint', def: 'A restriction on the developer\'s design or implementation choices, such as a mandated language or maximum file size.', related: ['Business rule'] },
    { term: 'Interview', def: 'A one-to-one or small-group conversation to elicit requirements; good for rapport and sensitive topics, weak on tacit knowledge.', related: ['Straw man model'] },
    { term: 'Workshop', def: 'A facilitated session of carefully chosen stakeholders with formal roles that works toward agreed requirements deliverables.', related: ['Facilitator', 'Focus group'] },
    { term: 'Facilitator', def: 'The workshop role that plans and guides the session and keeps it neutral and productive.', related: ['Workshop'] },
    { term: 'Focus group', def: 'A facilitated session of representative users who give opinions on functional and quality requirements; qualitative, no decision authority.', related: ['Workshop'] },
    { term: 'Observation', def: 'Watching users perform tasks to learn habitual steps they cannot describe; may be silent or interactive; time consuming.', related: ['Ethnography'] },
    { term: 'Ethnography', def: 'Prolonged immersion in the working environment to discover implicit requirements arising from actual practice and cooperation.', related: ['Observation'] },
    { term: 'Questionnaire', def: 'A written survey to gather input from many users cheaply; quality depends on well-written, tested questions.', related: ['Survey'] },
    { term: 'System interface analysis', def: 'Examining connected systems to find requirements for data and service exchange with them.', related: ['User interface analysis'] },
    { term: 'User interface analysis', def: 'Studying existing or similar systems to find user and functional requirements and to draft use cases.', related: ['Document analysis'] },
    { term: 'Document analysis', def: 'Examining documents such as SRSs, manuals, standards and regulations for requirements; may be outdated.', related: ['User interface analysis'] },
    { term: 'SMART', def: 'Characteristics of a good requirement: Specific, Measurable, Agreed upon, Realistic, Time-based.', related: ['Verifiable'] }
  ]
});
