RE.register({
  id: 'l1', num: 1,
  title: 'Introduction to Requirements Engineering',
  short: 'Introduction',
  slides: 38,
  lede: 'Requirements engineering is how a team finds out what a system must do and be, before building it. Get it wrong and projects fail expensively, so this lecture covers what a requirement is, the types, and the seven RE activities.',
  outcomes: [
    'Define a requirement and requirements engineering using several textbook definitions',
    'Explain why poor requirements are costly, using the lecture failure cases',
    'Distinguish user from system requirements, and functional from non-functional ones',
    'Classify non-functional requirements as product, organizational or external',
    'Describe what each RE activity does and how it is carried out, and tell verification from validation'
  ],
  sections: [
    {
      id: 'what-is-re',
      title: 'What a requirement is, and what RE is',
      html: `<p>The slides give you several definitions of a <span class="term">requirement</span>. They look different but circle the same idea: a requirement is something the stakeholders need that constrains or drives what gets built.</p>
<ul>
<li>Anything that <strong>drives design choices</strong> (the informal, memorable one).</li>
<li>A <strong>property a product must have to provide value to a stakeholder</strong>.</li>
<li>Both the <strong>user's view of external system behavior</strong> and the <strong>developer's view of internal characteristics</strong>.</li>
<li>The behavior of the system under specific conditions <em>and</em> the properties that make it suitable and enjoyable to use.</li>
<li>A <strong>specification of what should be implemented</strong>: a description of how the system should behave, a system property or attribute, or a <strong>constraint on the development process</strong>.</li>
</ul>
<p><span class="term">Requirements engineering (RE)</span> is the activity of <strong>elicitation, specification, analysis and management</strong> of the stakeholder requirements that a new or evolving system must meet. Practice Assignment 1 words it as identifying the purpose of a software system so that it captures the real-world needs of stakeholders.</p>
<aside class="note">Notice that the definitions include properties and constraints, not just behavior. A requirement is not only "what the system does". Speed, security, and even "must be written in Java" are all requirements.</aside>
<p>Wiegers adds two useful points. First, a requirement postponed to a later release is still a requirement; do not waste time arguing whether it "really" counts. Second, <em>product</em> requirements (properties of the software, which go in the SRS) differ from <em>project</em> requirements (training, tools, release procedures), which do not.</p>
<aside class="pitfall">Exam trap: if asked "is a constraint on the development process a requirement?", the answer is yes. The Sommerville and Sawyer definition on the slides explicitly includes it.</aside>`,
      visual: null,
      takeaways: [
        'A requirement is anything that drives design choices or is a property a product needs to give stakeholders value.',
        'Requirements cover behavior, properties and constraints on the development process.',
        'RE = elicitation, specification, analysis and management of stakeholder requirements.'
      ],
      source: 'Lecture 1, slides 16-18 · Practice Assignment 1 · Wiegers ch.1 · Sommerville ch.4'
    },
    {
      id: 'cost-of-bad-requirements',
      title: 'Why RE matters: the cost of bad requirements',
      html: `<p>Most failed software projects do not fail because the code was badly written. They fail because the team built something that was <em>not what was needed</em>, or because what was needed kept moving. The lecture shows five cases. For each, remember the <strong>requirements lesson</strong>, not just the story.</p>
<table class="tbl">
<thead><tr><th>Case</th><th>What happened</th><th>Requirements lesson</th></tr></thead>
<tbody>
<tr><td>Dodge Dart vs Porsche Cayenne</td><td>Two very different products shown side by side</td><td>Different customers and purposes need different requirements. A product built for the wrong audience fails however well it is built.</td></tr>
<tr><td>Polaroid video project</td><td>2.5-minute time limit, no sound, could not play on a regular TV</td><td>Constraints and everyday usage needs were not elicited, so the product was unusable in real life.</td></tr>
<tr><td>F-35 target error</td><td>Aircraft flying in formation "saw double" and mis-targeted; a software error</td><td>Unstated situations (formation flying) were never specified or validated.</td></tr>
<tr><td>CareFusion Alaris pump recall</td><td>Overdose when not needed, delayed infusion; a software error with deadly consequences</td><td>Safety and reliability requirements in critical systems are life-or-death.</td></tr>
<tr><td>NHS civilian IT</td><td>Electronic records, scanning and integrated IT across hospitals; scope creep; about 11.4 billion GBP</td><td>Uncontrolled change and unclear scope are requirements-management failures.</td></tr>
</tbody></table>
<p>The slides also point to survey data on the top causes of project failure. Requirements-related causes (poor requirements, changing requirements, unclear scope) appear near the top of such lists.</p>
<aside class="note">Why is a requirements error so expensive? The same wrong decision gets carried into design, code, tests and documentation. Fixing it late means redoing all of those, so the later it is found, the more it costs. Books on the subject cite figures as high as roughly 200 times the cost compared with fixing it at requirements time.</aside>
<aside class="pitfall">Do not label these cases as "coding bugs". The F-35 and Alaris cases involved software errors, but the lecture's point is that the root issue sits upstream in requirements: missing, wrong or unvalidated ones.</aside>`,
      visual: 'failure-cases',
      takeaways: [
        'Most costly failures trace back to missing, wrong, or uncontrolled requirements.',
        'Polaroid: unelicited constraints. F-35: unspecified situation. Alaris: safety. NHS: scope creep.',
        'A requirements error found late costs far more because design, code and tests all change.'
      ],
      source: 'Lecture 1, slides 10-15 · Perspectives on Software Requirements ch.1 · Sommerville ch.4'
    },
    {
      id: 'user-vs-system-fr',
      title: 'Functional requirements: user vs system level',
      html: `<p>Requirements are split in two independent ways. This section handles the first split: <strong>functional vs non-functional</strong>, and within functional, <strong>user vs system</strong> level. Do not mix these two axes up.</p>
<p>A <span class="term">functional requirement (FR)</span> states a service the system must provide, how it reacts to particular inputs, and how it behaves in particular situations. It may also say what the system must <em>not</em> do.</p>
<p>The slides divide functional requirements by level of detail and by reader:</p>
<ul>
<li><strong>User requirements</strong>: high-level statements, in natural language and diagrams, of what the system or its actors can do. Written for client managers and end users.</li>
<li><strong>System requirements</strong>: more detailed descriptions of the system's functions, services and operational constraints. Written for developers, architects and engineers. They define exactly what is to be implemented.</li>
</ul>
<aside class="example"><p><strong>User requirement:</strong> "The system shall generate monthly management reports showing the cost of drugs prescribed by each clinic during that month."</p>
<p><strong>System requirements (the same idea, zoomed in):</strong> the report runs on the last working day of the month; it is generated automatically for printing after 17:30; there is one report per clinic listing drug names, number of prescriptions, doses and total cost; access is restricted to authorized users.</p></aside>
<p>Wiegers provides a longer ladder that helps in exams: <strong>business requirement</strong> (why the organization wants the system) leads to <strong>user requirement</strong> (what users must be able to do) and then to <strong>functional requirement</strong> (what developers must implement). Lecture 4 develops this as Why, What, How.</p>
<aside class="pitfall">"User requirement" vs "system requirement" is about <strong>level of detail and audience</strong>, not about functional vs non-functional. Both levels can contain FRs and NFRs.</aside>
<aside class="pitfall">Imprecise FRs hurt. A psychiatrist asked to "search the appointments lists for all clinics" meant: type a patient name and search every clinic. The developer built: choose a clinic first, then search. Ambiguity is usually resolved in the developer's favour, not the customer's.</aside>`,
      visual: 'req-levels',
      takeaways: [
        'FRs describe services and behavior; they can be written at user level or system level.',
        'User requirements are abstract and for customers; system requirements are detailed and for developers.',
        'Level of detail is a separate axis from functional vs non-functional.'
      ],
      source: 'Lecture 1, slides 20-23 · Sommerville ch.4.1-4.3 (Fig 4.1) · Wiegers ch.1'
    },
    {
      id: 'nfr-types',
      title: 'Non-functional requirements: three families',
      html: `<p>A <span class="term">non-functional requirement (NFR)</span> is not about a feature. It describes a property of the system as a whole or a constraint on it: security, reliability, usability, performance and so on. The slides summarize it as "system related, not feature related".</p>
<p>The lecture then splits NFRs by <strong>where they come from</strong>:</p>
<table class="tbl">
<thead><tr><th>Family</th><th>Source</th><th>Patient-management example from the slides</th></tr></thead>
<tbody>
<tr><td><strong>Product</strong></td><td>Behavior of the software itself (speed, memory, reliability, usability, security)</td><td>The system shall be available to all clinics Mon-Fri, 08:30-17:30. Downtime within working hours shall not exceed five seconds in any one day.</td></tr>
<tr><td><strong>Organizational</strong></td><td>Policies and procedures of the customer's or developer's organization (operational, development, environmental)</td><td>Users shall authenticate themselves using their health authority identity card.</td></tr>
<tr><td><strong>External</strong></td><td>Factors outside the system and its organization (regulatory, legislative, ethical)</td><td>The system shall implement patient privacy provisions as set by law.</td></tr>
</tbody></table>
<p>Product NFRs are often listed as the quality attributes: <strong>security, performance, usability, scalability, availability, reliability, maintainability, recoverability</strong>. Wiegers splits these into those visible while running (availability, performance, usability, security, reliability) and those mattering mostly to developers (maintainability/modifiability, scalability, portability).</p>
<aside class="note">Quick test for classification: ask "where does this statement come from?" Behavior of the software: product. The company's own rule or tool choice: organizational. Law, regulator or ethics: external.</aside>
<aside class="example"><p>"The system shall be developed in Java using the department's coding standard" is <strong>organizational</strong> (a development process rule). "The system shall be approved by the central bank before use" is <strong>external</strong> (regulatory). "95 percent of transactions complete within 2 seconds" is a <strong>product</strong> NFR (performance).</p></aside>
<aside class="pitfall">Do not classify by keyword. "Security" can be product (encryption speed), organizational (company password policy) or external (data-protection law). Look at the source.</aside>`,
      visual: 'req-sorter',
      takeaways: [
        'NFRs constrain the system as a whole; they are about how well, not what.',
        'Product = software behavior; organizational = internal policy; external = law, regulators, ethics.',
        'Classify by the source of the statement, not by its topic word.'
      ],
      source: 'Lecture 1, slides 24-27 · Sommerville ch.4.1.2 (Fig 4.3, 4.4) · Wiegers ch.14 (Table 14-1)'
    },
    {
      id: 'nfr-measurable-critical',
      title: 'Measurable NFRs, and why NFRs often matter more',
      html: `<p>Vague NFRs ("fast", "easy to use", "reliable") cannot be built or tested. Write each as a <strong>verifiable</strong> statement with a metric. The lecture's wheel pairs each type with something you can measure.</p>
<table class="tbl">
<thead><tr><th>NFR</th><th>Example of a measure</th></tr></thead>
<tbody>
<tr><td>Performance</td><td>Transactions per second; response time</td></tr>
<tr><td>Usability</td><td>Training time; errors per hour for experienced users</td></tr>
<tr><td>Reliability</td><td>Mean time to failure; rate of failure occurrence</td></tr>
<tr><td>Availability</td><td>Uptime percentage; allowed downtime per day</td></tr>
<tr><td>Scalability</td><td>Number of concurrent users or data volume supported without degradation</td></tr>
<tr><td>Maintainability</td><td>Time to locate and fix a defect; effort per change</td></tr>
<tr><td>Recoverability</td><td>Time to restart or restore data after a failure</td></tr>
<tr><td>Security</td><td>Number of unauthorized-access attempts blocked; required authentication method</td></tr>
</tbody></table>
<aside class="example"><p>Vague: "Medical staff should find the system easy to use."</p><p>Testable: "Medical staff shall be able to use all system functions after four hours of training. After training, experienced users shall make no more than two errors per hour."</p></aside>
<p><strong>An NFR can generate FRs.</strong> "Only authorized users may access patient records" sounds non-functional, yet it creates functional requirements: a login screen, password reset, access-control list management. In reality the FR/NFR boundary is not clear cut; one NFR may also restrict several existing FRs.</p>
<p><strong>Why are NFRs often more critical than FRs?</strong> Users can work around a missing or clumsy function. But if the system is too slow, insecure, unreliable or unlawful, the <em>whole</em> system becomes unusable or cannot be certified. NFRs also shape the overall architecture, so adding them late is very expensive.</p>
<aside class="pitfall">NFRs conflict with each other. Stronger security (extra authentication, encryption) lowers performance and usability. Good requirements work records the trade-off and prioritizes, rather than pretending all can be maximized.</aside>`,
      visual: 'nfr-wheel',
      takeaways: [
        'Rewrite vague NFRs with a measurable metric so they can be verified.',
        'An NFR can generate FRs; the FR/NFR split is not clear cut.',
        'NFR failure can make the entire system unusable, and NFRs shape architecture, so they are often more critical.'
      ],
      source: 'Lecture 1, slides 25-28 · Sommerville ch.4.1.2 (Fig 4.5) · Wiegers ch.14'
    },
    {
      id: 're-activities',
      title: 'The RE activities and how each is done',
      html: `<p>RE is not one step. The lecture presents seven activities. In practice they overlap and repeat; the order below is a teaching order.</p>
<table class="tbl">
<thead><tr><th>Activity</th><th>What it does</th><th>How (techniques)</th></tr></thead>
<tbody>
<tr><td><strong>1. Inception</strong></td><td>First phase. Understand the business and market, build the business case and feasibility study, understand the nature of the solution, develop a preliminary solution. Effective communication with managers, marketing, end users and engineers is essential.</td><td>Brainstorming, joint application development meetings</td></tr>
<tr><td><strong>2. Elicitation</strong></td><td>Define scope, identify user requirements and constraints, collect from stakeholders, documents, existing systems and domain experts. Typical problems: volatility, ill-defined or over-detailed requirements, developer-customer misunderstanding.</td><td>Brainstorming, interviews, observation, use cases, scenarios, prototyping</td></tr>
<tr><td><strong>3. Elaboration</strong></td><td>Refine and expand what the first two phases produced; look deeper and build models.</td><td>Prototyping, analysis models</td></tr>
<tr><td><strong>4. Negotiation</strong></td><td>Agree needs vs wants, decide what to eliminate, prioritize with risk in mind, remove conflicts. Discussions revolve around resources, delivery time, cost and scope.</td><td>Prioritization and conflict resolution meetings</td></tr>
<tr><td><strong>5. Specification</strong></td><td>Document functions, features and constraints in a form the customer understands; submit it to the customer.</td><td>SRS, UML, ERD, use cases, UI/UX tools such as Figma</td></tr>
<tr><td><strong>6. Verification and validation</strong></td><td>Technical review for missing information and errors; check against standards.</td><td>Sanity check, test-case generation, inspection, review, coded or design prototypes</td></tr>
<tr><td><strong>7. Management</strong></td><td>Identify, control and track requirements through implementation. Requirements change over time.</td><td>Baselines, change control, traceability</td></tr>
</tbody></table>
<aside class="note">Sommerville names fewer activities: feasibility study, elicitation and analysis, specification, validation. Map them: inception is roughly the feasibility study; elaboration and negotiation are the "analysis" part; Wiegers treats management as a separate discipline from "requirements development".</aside>
<aside class="pitfall">Do not treat the list as a waterfall. In the worked golf-cart practice, negotiation and validation send you back to elicitation. Iteration is normal, and requirements will change.</aside>`,
      visual: 're-process',
      takeaways: [
        'Seven activities: inception, elicitation, elaboration, negotiation, specification, V&V, management.',
        'Know what each does AND its typical techniques; exams ask for both.',
        'The activities overlap and iterate rather than run strictly in sequence.'
      ],
      source: 'Lecture 1, slides 29-36 · Practice Assignment 1 · Sommerville ch.2.2, 4.5 · Wiegers ch.1'
    },
    {
      id: 'verification-validation',
      title: 'Verification vs validation',
      html: `<p>These two words are the classic exam confusion. The slide gives the one-line version:</p>
<ul>
<li><strong>Verification</strong>: are we building the product <em>right</em>? Does it conform to its specification and quality standards?</li>
<li><strong>Validation</strong>: are we building the <em>right</em> product? Does it meet what the customer actually needs?</li>
</ul>
<p>Applied to requirements documents:</p>
<ul>
<li>Verifying a requirement checks it is <em>well written</em>: unambiguous, consistent, complete, testable.</li>
<li>Validating a requirement checks it is the <em>right requirement</em>: it traces to a real business objective and the stakeholders really need it.</li>
</ul>
<p>Sommerville lists five validation checks: <strong>validity</strong> (is this function really needed?), <strong>consistency</strong> (no contradictions), <strong>completeness</strong> (nothing missing), <strong>realism</strong> (buildable with known technology, budget and schedule) and <strong>verifiability</strong> (a test can show it is met). Techniques: requirement reviews, prototyping, test-case generation.</p>
<aside class="example"><p>A requirement says "The system shall support a maximum file size of 10 MB" in one place and "20 MB" in another. That is caught by checking <strong>consistency</strong> (verification-style). A requirement "Print a fax cover sheet" that nobody in the business uses fails <strong>validity</strong> (validation).</p></aside>
<aside class="pitfall">Do not reverse them. Memory aid: <strong>Ver</strong>ification = "did we build it as <strong>ver</strong>ified in the spec"; <strong>Val</strong>idation = "has it <strong>val</strong>ue for the customer".</aside>`,
      visual: 'vv',
      takeaways: [
        'Verification: building the product right (meets spec). Validation: building the right product (meets needs).',
        'Validation checks: validity, consistency, completeness, realism, verifiability.',
        'Techniques: reviews and inspections, prototypes, test-case generation.'
      ],
      source: 'Lecture 1, slide 36 · Sommerville ch.4.6 · Wiegers ch.17'
    },
    {
      id: 'course-logistics',
      title: 'Course logistics (CSEN406)',
      html: `<p>A short orientation, since it frames what is examined.</p>
<table class="tbl">
<thead><tr><th>Component</th><th>Weight</th></tr></thead>
<tbody>
<tr><td>Project</td><td>40%</td></tr>
<tr><td>Midterm exam</td><td>25%</td></tr>
<tr><td>Final exam</td><td>35%</td></tr>
</tbody></table>
<p><strong>Topics:</strong> introduction to RE; elicitation; use case modeling; negotiation, triage and prioritization; requirements modeling I and II; requirements analysis; goal modeling I and II; specifying systems; functional modeling; verification and validation.</p>
<p><strong>Learning outcomes:</strong> understand functional and non-functional requirements; apply different solicitation techniques; analyze FRs and NFRs to build UML models and write a software requirement specification; work in teams and use solicitation techniques to extract information.</p>
<p><strong>References:</strong> Wiegers and Beatty, <em>Software Requirements</em> (3rd ed.) and Sommerville, <em>Software Engineering</em> (9th ed.).</p>
<aside class="note">The project is the largest single item. Practice the techniques from Lecture 2 early, because the project needs real elicitation and a specification.</aside>`,
      visual: null,
      takeaways: [
        'Grading: project 40%, midterm 25%, final 35%.',
        'Main texts: Wiegers and Beatty, and Sommerville.',
        'Outcomes stress FR/NFR understanding, elicitation techniques, UML and an SRS.'
      ],
      source: 'Lecture 1, slides 2-7, 37'
    }
  ],
  practice: [
    {
      id: 'pa1-golf-cart',
      title: 'Practice Assignment 1: RE process for a golf cart',
      source: 'Practice Assignment 1',
      prompt: `<p>A stakeholder has a vision for a <strong>golf cart</strong> and approaches a software company. The Requirements Engineer starts by defining the project scope and documenting functional and non-functional requirements.</p>
<p><strong>Task:</strong> state the processes/activities of RE, using the golf cart to illustrate what the RE team does at each stage. Think about what the question asks first: both the list and a worked example.</p>`,
      visual: 'golf-cart',
      steps: [
        { q: 'List the RE activities, in order.', a: `<p>The assignment lists: <strong>inception, elicitation, analysis and negotiation, specification, validation, management</strong>. The lecture splits the analysis part into <strong>elaboration</strong> and <strong>negotiation</strong> and calls validation <strong>verification and validation</strong>, giving seven. Quote whichever version the question uses.</p>` },
        { q: 'Inception: what does the RE team do for the golf cart?', a: `<p>Understand why the stakeholder wants the cart (course owner? resort? rental business?), the market, and whether it is feasible and worth the cost. Output: a preliminary vision and business case, e.g. "reduce rental fleet cost and give golfers GPS yardage". Technique: brainstorming or a joint meeting with the stakeholder.</p>` },
        { q: 'Elicitation and elaboration: which requirements would you gather, and how?', a: `<p>Interview the owner and golfers; observe how carts are used on the course; analyze existing cart documentation. Gather <strong>FRs</strong> ("the driver shall be able to see the distance to the hole", "the cart shall allow the course manager to restrict it to the paths") and <strong>NFRs</strong> ("battery life of at least 36 holes", "the touchscreen shall remain readable in direct sunlight"). Elaboration then refines these through a prototype of the screen and a model of the speed-limit logic.</p>` },
        { q: 'Negotiation: what conflict might appear and how is it settled?', a: `<p>The owner wants low cost, the golfers want a big screen and long battery. Negotiate scope and priority: pick the must-have features for release 1 and defer extras (for example, food ordering), weighing cost, time and risk.</p>` },
        { q: 'Specification and V&V: what is produced and checked?', a: `<p>Document the agreed requirements in an SRS (plus use cases and UI mock-ups) in language the stakeholder understands. Then <strong>verify</strong> the document is consistent, complete, testable, and <strong>validate</strong> with the stakeholder that it is the right cart. Techniques: inspection, test-case generation, prototype review.</p>` },
        { q: 'Management: why is it still needed after the document is approved?', a: `<p>Requirements change (a new safety rule, a new feature request). Management baselines the approved set, controls changes through impact analysis, and traces each requirement to design and tests, so changes are tracked rather than uncontrolled.</p>` }
      ]
    }
  ],
  flashcards: [
    { id: 'l1-f01', front: 'Give three different definitions of a requirement from the slides.', back: 'Anything that drives design choices; a property a product must have to give a stakeholder value; a specification of what should be implemented, including behavior, properties and constraints on the development process.', tag: 'definition' },
    { id: 'l1-f02', front: 'Define requirements engineering.', back: 'The activity of elicitation, specification, analysis and management of the stakeholder requirements that a new or evolving system must meet. It identifies the purpose of the system and captures real-world stakeholder needs.', tag: 'definition' },
    { id: 'l1-f03', front: 'Why does a late requirements error cost so much?', back: 'The mistake spreads into design, code, tests and documentation. Fixing it late means changing all of those, so cost grows the later it is found.', tag: 'definition' },
    { id: 'l1-f04', front: 'Polaroid project: what went wrong?', back: 'The product had a 2.5-minute time limit, no sound, and could not play on a regular TV. Real usage needs and constraints were never elicited.', tag: 'example' },
    { id: 'l1-f05', front: 'F-35 target error: what is the requirements lesson?', back: 'Aircraft flying in formation saw double and mis-targeted, a software error. A realistic operating situation was not specified or validated.', tag: 'example' },
    { id: 'l1-f06', front: 'CareFusion Alaris pump recall: what is the lesson?', back: 'Software caused overdoses when not needed and delayed infusions, potentially deadly. Safety and reliability requirements in critical systems must be explicit and validated.', tag: 'example' },
    { id: 'l1-f07', front: 'NHS civilian IT: which requirements problem and how big?', back: 'Scope creep on electronic records, scanning and integrated IT across hospitals, costing about 11.4 billion GBP. A requirements management and scope control failure.', tag: 'example' },
    { id: 'l1-f08', front: 'Functional requirement: definition.', back: 'A statement of a service the system should provide, how it reacts to inputs and behaves in situations. It may also state what the system must not do.', tag: 'definition' },
    { id: 'l1-f09', front: 'User requirement vs system requirement?', back: 'User: high-level, natural language, for customers and end users. System: detailed functions, services and operational constraints, for developers; defines exactly what to implement. It is a difference of detail and audience.', tag: 'compare' },
    { id: 'l1-f10', front: 'Non-functional requirement: definition.', back: 'A property of, or constraint on, the system as a whole (security, performance, reliability, usability). It is system related, not feature related.', tag: 'definition' },
    { id: 'l1-f11', front: 'Name the three NFR families.', back: 'Product (software behavior), organizational (customer or developer policies and procedures), and external (law, regulators, ethics).', tag: 'definition' },
    { id: 'l1-f12', front: 'Which family: "Users shall authenticate using their health authority identity card"?', back: 'Organizational. It stems from the health authority organization\'s own procedures, not from the software\'s behavior or from law.', tag: 'apply' },
    { id: 'l1-f13', front: 'Which family: "The system shall implement patient privacy provisions as set by law"?', back: 'External (legislative). The requirement comes from outside the system and the organization.', tag: 'apply' },
    { id: 'l1-f14', front: 'Which family: "Downtime within working hours shall not exceed five seconds a day"?', back: 'Product NFR (availability). It constrains how the software behaves.', tag: 'apply' },
    { id: 'l1-f15', front: 'List the product NFR types on the slide.', back: 'Security, performance, usability, scalability, availability, reliability, maintainability, recoverability.', tag: 'definition' },
    { id: 'l1-f16', front: 'How can an NFR lead to an FR?', back: '"Only authorized users may view records" is non-functional but creates functional requirements such as login, password reset and access-list management.', tag: 'example' },
    { id: 'l1-f17', front: 'Why are NFRs often more critical than FRs?', back: 'Users can work around a weak function, but a system that is too slow, insecure, unreliable or unlawful is unusable or uncertifiable. NFRs also shape the whole architecture.', tag: 'compare' },
    { id: 'l1-f18', front: 'Inception: purpose and techniques?', back: 'The first phase: understand business and market, build the business case and feasibility, grasp the nature of the solution. Techniques: brainstorming, joint application development meetings.', tag: 'definition' },
    { id: 'l1-f19', front: 'Elicitation: what problems does it face?', back: 'Volatile requirements, ill-defined or over-detailed ones, and lack of understanding between developers and customers. Sources: stakeholders, documents, existing systems, domain experts.', tag: 'definition' },
    { id: 'l1-f20', front: 'Elaboration: what is done?', back: 'Refine and expand the output of inception and elicitation by modeling, using prototypes and analysis models.', tag: 'definition' },
    { id: 'l1-f21', front: 'Negotiation: what is discussed?', back: 'Needs vs wants, what to eliminate, priorities with risk factored in; resources, delivery time, cost and scope; removal of conflicts.', tag: 'definition' },
    { id: 'l1-f22', front: 'Specification: output and tools?', back: 'A written, customer-readable document (SRS) plus models, use cases, prototypes. Tools: UML, ERD, Figma, InVision.', tag: 'definition' },
    { id: 'l1-f23', front: 'Verification vs validation in one line each.', back: 'Verification: building the product right (conforms to spec). Validation: building the right product (meets real customer needs).', tag: 'compare' },
    { id: 'l1-f24', front: 'Requirements management: what and why?', back: 'Identify, control and track requirements through implementation. Needed because requirements change over time.', tag: 'definition' },
    { id: 'l1-f25', front: 'Course grading split?', back: 'Project 40 percent, midterm exam 25 percent, final exam 35 percent.', tag: 'definition' },
    { id: 'l1-f26', front: 'Rewrite "The system should be easy to use" as a testable NFR.', back: 'For example: "Medical staff shall be able to use all functions after four hours of training, and experienced users shall make no more than two errors per hour."', tag: 'apply' }
  ],
  quiz: [
    { id: 'l1-q01', kind: 'single', level: 'concept', prompt: 'Which definition best matches the lecture\'s informal description of a requirement?', options: ['A line of code that implements a feature', 'Anything that drives design choices', 'A test case written by the QA team', 'The final user manual'], answer: 1, why: 'The slides define a requirement informally as anything that drives design choices. Code, tests and manuals are products of later work, not requirements themselves.' },
    { id: 'l1-q02', kind: 'single', level: 'concept', prompt: 'Which activity is the first phase of the RE process in the lecture?', options: ['Elicitation', 'Specification', 'Inception', 'Negotiation'], answer: 2, why: 'Inception comes first: understanding the business, market and feasibility. Elicitation is second. The tempting answer is elicitation because it is the best-known activity.' },
    { id: 'l1-q03', kind: 'tf', level: 'concept', prompt: 'A constraint on the development process (for example, a mandated programming language) counts as a requirement.', answer: true, why: 'The Sommerville and Sawyer definition on the slides explicitly includes constraints on the development process.' },
    { id: 'l1-q04', kind: 'single', level: 'concept', prompt: 'Which pair correctly matches a failure case to its requirements lesson?', options: ['NHS IT - missing sound', 'Polaroid - scope creep', 'F-35 - unspecified formation-flying situation', 'Alaris pump - wrong target audience'], answer: 2, why: 'F-35 mis-targeted when flying in formation, a situation not specified or validated. NHS is scope creep; Polaroid is unelicited constraints; Alaris is safety.' },
    { id: 'l1-q05', kind: 'single', level: 'concept', prompt: 'What does the slide say about the relationship between FRs and NFRs?', options: ['They are always cleanly separable', 'An NFR can lead to the development of an FR', 'NFRs only matter after delivery', 'FRs are always more critical'], answer: 1, why: 'The slide notes an NFR may lead to an FR and the line is not clear cut in reality. Security, for example, creates login functions.' },
    { id: 'l1-q06', kind: 'tf', level: 'concept', prompt: 'Verification asks "are we building the right product?" and validation asks "are we building the product right?".', answer: false, why: 'Reversed. Verification is building the product right (meets spec); validation is building the right product (meets customer needs).' },
    { id: 'l1-q07', kind: 'single', level: 'theory', prompt: 'What is the main difference between user requirements and system requirements?', options: ['User requirements are non-functional; system requirements are functional', 'User requirements are high-level and for customers; system requirements are more detailed and for developers', 'User requirements are written in UML; system requirements in natural language', 'There is no difference'], answer: 1, why: 'The axis is level of detail and audience. Both levels can hold FRs and NFRs, so the first option confuses two separate axes.' },
    { id: 'l1-q08', kind: 'multi', level: 'theory', prompt: 'Select ALL families of non-functional requirement named in the lecture.', options: ['Product', 'Organizational', 'Behavioral', 'External'], answer: [0, 1, 3], why: 'The lecture families are product, organizational and external. "Behavioral" is not an NFR family; behavior is what functional requirements describe.' },
    { id: 'l1-q09', kind: 'single', level: 'theory', prompt: 'Why can NFRs be more critical than FRs?', options: ['They are always more expensive to write', 'Users can work around a missing function, but a failing system-wide property can make the whole system unusable', 'FRs are never tested', 'NFRs are agreed first in every project'], answer: 1, why: 'A poor function can be avoided; a system that is too slow, unreliable or insecure fails as a whole and may not be certifiable.' },
    { id: 'l1-q10', kind: 'multi', level: 'theory', prompt: 'Select ALL techniques the lecture lists for the elicitation activity.', options: ['Brainstorming', 'Interviews', 'Observation', 'Compiling the source code'], answer: [0, 1, 2], why: 'Brainstorming, interviews, observation, use cases, scenarios and prototyping are listed. Compiling is an implementation step, unrelated to elicitation.' },
    { id: 'l1-q11', kind: 'single', level: 'theory', prompt: 'In which RE activity are needs vs wants discussed, priorities set, and conflicts removed?', options: ['Elaboration', 'Negotiation', 'Specification', 'Management'], answer: 1, why: 'Negotiation covers needs vs wants, elimination, prioritization with risk, and discussions of resources, time, cost and scope. Elaboration refines and models.' },
    { id: 'l1-q12', kind: 'tf', level: 'theory', prompt: 'Validating a requirements document means checking that it is well written, with no ambiguity or contradictions.', answer: false, why: 'That describes verification-style checking of quality. Validation asks whether these are the right requirements the stakeholders actually need.' },
    { id: 'l1-q13', kind: 'single', level: 'practice', prompt: '"The system shall be available to all clinics Mon-Fri 08:30-17:30; downtime shall not exceed five seconds in any one day." Which type is it?', options: ['Organizational NFR', 'External NFR', 'Product NFR', 'User functional requirement'], answer: 2, why: 'It constrains how the software behaves (availability), so it is a product NFR. It cites no company policy or law, ruling out the other NFR families.' },
    { id: 'l1-q14', kind: 'single', level: 'practice', prompt: '"The system shall comply with the national data-protection law when storing citizen records." Which type is it?', options: ['Product NFR', 'Organizational NFR', 'External NFR', 'System functional requirement'], answer: 2, why: 'The source is legislation outside the organization, so it is external. It is tempting to call it a product NFR because it concerns security, but the source decides.' },
    { id: 'l1-q15', kind: 'single', level: 'practice', prompt: '"All developers must use the department\'s Java coding standard." Which type is it?', options: ['Organizational NFR', 'External NFR', 'Product NFR', 'Functional requirement'], answer: 0, why: 'It comes from the developer organization\'s own procedures and constrains the development process, so it is organizational.' },
    { id: 'l1-q16', kind: 'single', level: 'practice', prompt: 'A stakeholder says "the app must be fast". What should the analyst do?', options: ['Record it as is', 'Rewrite it as a measurable statement, e.g. 95 percent of searches return within 2 seconds', 'Delete it because it is not a requirement', 'Move it to the user manual'], answer: 1, why: 'Vague NFRs are unverifiable. Adding a metric makes it testable. Deleting it throws away a real quality need.' },
    { id: 'l1-q17', kind: 'single', level: 'practice', prompt: 'A hospital app requirement says "Only doctors may view lab results." What is the best analysis?', options: ['It is non-functional only, so no FRs follow', 'It is non-functional but generates FRs such as login and role management', 'It is a pure user interface issue', 'It belongs in the project plan, not the requirements'], answer: 1, why: 'Security is an NFR that creates functional requirements (authentication, access control). The lecture stresses the FR/NFR boundary is not clear cut.' },
    { id: 'l1-q18', kind: 'multi', level: 'practice', prompt: 'A team reviews a draft SRS and finds a requirement nobody in the business needs, plus two requirements with conflicting file-size limits. Select ALL checks that caught problems.', options: ['Validity', 'Consistency', 'Realism', 'Compiling the code'], answer: [0, 1], why: 'The unneeded requirement fails validity; the conflicting limits fail consistency. Nothing was said about feasibility (realism), and compiling is irrelevant at this stage.' },
    { id: 'l1-q19', kind: 'single', level: 'practice', prompt: 'A project\'s costs balloon because stakeholders keep adding features after sign-off with no impact analysis. Which RE activity failed?', options: ['Inception', 'Specification', 'Management', 'Elaboration'], answer: 2, why: 'Uncontrolled change is a requirements management failure, as in the NHS case. Management is meant to identify, control and track changes.' },
    { id: 'l1-q20', kind: 'tf', level: 'practice', prompt: 'In the golf-cart exercise, "the cart shall show distance to the hole" is functional while "battery lasts 36 holes" is non-functional.', answer: true, why: 'The first states a service (a feature); the second constrains a system property (a product quality). That is the FR/NFR distinction.' }
  ],
  glossary: [
    { term: 'Requirement', def: 'Anything that drives design choices; a property a product must have to give a stakeholder value; a specification of what should be implemented, including behavior, properties and process constraints.', related: ['Requirements engineering', 'Stakeholder'] },
    { term: 'Requirements engineering', def: 'The activity of elicitation, specification, analysis and management of stakeholder requirements for a new or evolving system.', related: ['Requirement', 'Elicitation'] },
    { term: 'Stakeholder', def: 'Anyone with a direct or indirect influence on or interest in the requirements, such as users, managers, domain experts and engineers of related systems.', related: ['Elicitation'] },
    { term: 'Functional requirement', def: 'A statement of a service the system must provide, how it reacts to inputs, and how it behaves in specific situations.', related: ['Non-functional requirement', 'User requirement'] },
    { term: 'Non-functional requirement', def: 'A property of or constraint on the system as a whole, such as security or performance. System related, not feature related.', related: ['Functional requirement', 'Quality attribute'] },
    { term: 'User requirement', def: 'A high-level statement, in natural language and diagrams, of what the system or its actors can do, written for customers and end users.', related: ['System requirement'] },
    { term: 'System requirement', def: 'A more detailed description of the system\'s functions, services and operational constraints, written for developers and defining what is to be implemented.', related: ['User requirement'] },
    { term: 'Product requirement', def: 'An NFR constraining the behavior of the software, for example performance, reliability, usability, availability or security.', related: ['Organizational requirement', 'External requirement'] },
    { term: 'Organizational requirement', def: 'An NFR derived from the policies and procedures of the customer or developer organization, such as an authentication method or coding standard.', related: ['Product requirement', 'External requirement'] },
    { term: 'External requirement', def: 'An NFR from factors outside the system and its organization: regulatory, legislative or ethical.', related: ['Product requirement', 'Organizational requirement'] },
    { term: 'Quality attribute', def: 'A kind of NFR describing how well the system performs a service, often called the "-ilities": reliability, usability, maintainability and so on.', related: ['Non-functional requirement'] },
    { term: 'Scope creep', def: 'Uncontrolled growth of what a project is expected to deliver, without matching changes to time and budget. The NHS IT case is the lecture example.', related: ['Requirements management'] },
    { term: 'Inception', def: 'The first RE phase: understanding the business and market, building the business case and feasibility study, and forming a preliminary solution.', related: ['Elicitation'] },
    { term: 'Elicitation', def: 'Discovering requirements from stakeholders, documents, existing systems and domain experts using interviews, observation, scenarios, prototypes and similar techniques.', related: ['Inception', 'Elaboration'] },
    { term: 'Elaboration', def: 'Refining and expanding earlier results by modeling and prototyping, going deeper into the requirements.', related: ['Elicitation', 'Specification'] },
    { term: 'Negotiation', def: 'Agreeing which needs to satisfy: separating needs from wants, prioritizing, factoring in risk, and resolving conflicts over resources, time, cost and scope.', related: ['Elaboration'] },
    { term: 'Specification', def: 'Documenting requirements in an SRS, models, use cases and prototypes in a form the customer understands.', related: ['SRS'] },
    { term: 'SRS', def: 'Software requirements specification: the written document that records the agreed functions, features and constraints of the system.', related: ['Specification'] },
    { term: 'Verification', def: 'Checking that the product (or requirements document) was built right: it conforms to its specification and quality standards.', related: ['Validation'] },
    { term: 'Validation', def: 'Checking that the right product is being built: the requirements and product meet the real needs of the customer.', related: ['Verification'] },
    { term: 'Requirements management', def: 'Identifying, controlling and tracking requirements and their changes throughout development.', related: ['Scope creep', 'Baseline'] },
    { term: 'Baseline', def: 'A snapshot of agreed, reviewed and approved requirements for a release, changed only through controlled change.', related: ['Requirements management'] }
  ]
});
