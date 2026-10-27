RE.register({
  id: 'l4', num: 4,
  title: `Requirements Modeling`,
  short: `Modeling`,
  slides: 15,
  lede: `Before you draw any diagram you need a clear way to separate the problem (why and what) from the solution (how). This lecture gives you the Why-What-How ladder and the WRSPM reference model, which tells you exactly what belongs to the world, the requirement, the specification, the program and the machine.`,
  outcomes: [
    `Map business, user and system requirements onto Why, What and How`,
    `Distinguish the problem domain from the solution domain`,
    `Classify any statement as W, R, S, P or M`,
    `Classify any phenomenon as eh, ev, sv or sh`,
    `State what must be shown: W and S entail R, and P on M implements S`
  ],
  sections: [
    {
      id: 'why-what-how',
      title: `Why, What and How`,
      html: `<p>Every system starts as a chain of three questions. <strong>Why</strong> is the system needed? <strong>What</strong> features will serve that purpose? <strong>How</strong> will the system be constructed? Dr. Zaki's slides line these up with the requirement levels you met in Lecture 1.</p>
<table class="tbl"><thead><tr><th>Question</th><th>Requirement level</th><th>Typical content</th><th>Typical artifact</th></tr></thead><tbody>
<tr><td>Why</td><td>Business requirement</td><td>Increase profit by 30%, gain 10% market share, increase number of customers</td><td>Vision and scope statement</td></tr>
<tr><td>What</td><td>User requirement</td><td>What the user must be able to do with the system</td><td>Use cases, sketches, prototypes</td></tr>
<tr><td>How</td><td>System requirement</td><td>Functional, non-functional and implementation requirements</td><td>Requirements specification, design</td></tr>
</tbody></table>
<p>Read the ladder downward as <em>refinement</em>: a business goal is served by features, and features are realized by system behaviour. Read it upward as <em>justification</em>: every system requirement should trace back to some user need, and every user need back to a business reason. A requirement with no "why" above it is a candidate for removal.</p>
<aside class="example">Why: gain 10% market share. What: customers can order online and track the order (use cases and screen sketches). How: the system shall update the order status within 5 seconds of a warehouse scan.</aside>
<aside class="note">Wiegers warns that the What/How split is a useful simplification, not a wall. Exploring a hypothetical "how" often helps you understand the "what". Use the ladder to organize thinking, not to forbid discussion.</aside>`,
      visual: 'why-what-how',
      takeaways: [
        `Why equals business requirement, what equals user requirement, how equals system requirement.`,
        `Why: profit, market share, customers. What: use cases, sketches, prototypes.`,
        `Read down to refine and up to justify; unjustified requirements are suspect.`
      ],
      source: `Lecture 4, slides 3–6 · Wiegers ch.1 (requirement levels) · Sommerville ch.4`
    },
    {
      id: 'domains',
      title: `Problem domain vs solution domain`,
      html: `<p>Lab 5 uses the Why-What-How model to separate two worlds. <strong>Requirements</strong> live in the <span class="term">problem domain</span>: they describe what users need in order to solve a real-world problem, in the users' own language. <strong>Specifications</strong> live in the <span class="term">solution (computer) domain</span>: they constrain what the computer or system does, in the system's language.</p>
<p>Your job as a requirements engineer is translation: take a need such as "I want to withdraw money" and turn it into a specification such as "when a valid card and PIN are entered and the amount is available, the machine dispenses that amount."</p>
<table class="tbl"><thead><tr><th></th><th>Requirement</th><th>Specification</th></tr></thead><tbody>
<tr><td>Domain</td><td>Problem (real world)</td><td>Solution (computer)</td></tr>
<tr><td>Language</td><td>The user's</td><td>The system's</td></tr>
<tr><td>About</td><td>Effects wanted in the environment</td><td>Behaviour at the system boundary</td></tr>
<tr><td>Example</td><td>Customer gets cash</td><td>Dispense amount when PIN is valid</td></tr>
</tbody></table>
<aside class="pitfall">Writing a requirement in terms of internal data or code ("the cache shall be flushed") means you jumped to the solution domain. A requirement talks about the world; a specification talks about the interface.</aside>`,
      visual: null,
      takeaways: [
        `Requirements belong to the problem domain; specifications belong to the solution domain.`,
        `Translating needs into specifications is the core RE task.`,
        `A requirement phrased with internal code or data is really a specification.`
      ],
      source: `Lab 5 (Why-What-How model) · Lecture 4 · Gunter et al. reference model`
    },
    {
      id: 'wrspm-five',
      title: `WRSPM: the five descriptions`,
      html: `<p>WRSPM is a reference model that splits a software problem into five kinds of description. Lab 5 defines each one:</p>
<table class="tbl"><thead><tr><th>Letter</th><th>Name</th><th>What it describes</th><th>ATM example</th></tr></thead><tbody>
<tr><td><strong>W</strong></td><td>World assumptions</td><td>Facts that hold regardless of your system; hard to capture but crucial</td><td>Banknotes loaded in the cassette are the ones dispensed</td></tr>
<tr><td><strong>R</strong></td><td>Requirements</td><td>What users need, in problem-domain language</td><td>The customer can withdraw money</td></tr>
<tr><td><strong>S</strong></td><td>Specification</td><td>How the system meets the need, in system language, plain actions at the interface</td><td>Insert card, enter PIN, choose amount, dispense cash</td></tr>
<tr><td><strong>P</strong></td><td>Program</td><td>All code and frameworks written to fulfil S</td><td>Withdrawal-handling software</td></tr>
<tr><td><strong>M</strong></td><td>Machine</td><td>The hardware platform P runs on</td><td>Roller that distributes money, lockbox, card reader</td></tr>
</tbody></table>
<p>The slide groups these into three regions: the <strong>environment</strong> (the world and the people in it), the <strong>system</strong> (program and machine), and the <strong>interface</strong> between them where the two sides share phenomena.</p>
<aside class="note">Why W matters: R is about things the machine cannot see (a stopped heart, a person's intention). Only the world assumption "no sensor signal means the heart has stopped" lets a specification about sensor input achieve a requirement about the patient.</aside>`,
      visual: 'wrspm',
      takeaways: [
        `W, R, S, P, M: world, requirements, specification, program, machine.`,
        `W, R sit in the environment; P, M in the system; S at the interface.`,
        `World assumptions are the bridge from what the machine sees to what users want.`
      ],
      source: `Lecture 4, slides 7–8 · Lab 5 (The WRSPM Model)`
    },
    {
      id: 'four-variables',
      title: `The four variables: eh, ev, sv, sh`,
      html: `<p>WRSPM classifies every <em>phenomenon</em> (event, state, object) by two questions: <strong>who controls it</strong> (environment e, or system s) and <strong>who can see it</strong> (subscript h = hidden from the other side, v = visible to the other side).</p>
<table class="tbl"><thead><tr><th>Glyph</th><th>Meaning on the slide</th><th>Controlled by</th><th>ATM example (Lab 5)</th></tr></thead><tbody>
<tr><td><code>eh</code></td><td>Environment hidden from the system</td><td>Environment</td><td>The card; the user's intention to withdraw</td></tr>
<tr><td><code>ev</code></td><td>Environment visible to the system</td><td>Environment</td><td>Data read from the mag strip; the PIN typed in</td></tr>
<tr><td><code>sv</code></td><td>System visible to the environment</td><td>System</td><td>Buttons, screen messages, dispensed cash</td></tr>
<tr><td><code>sh</code></td><td>System hidden from the environment</td><td>System</td><td>Internal roller; the bank-approval check before dispensing</td></tr>
</tbody></table>
<p>Only <code>ev</code> and <code>sv</code> are <strong>shared phenomena</strong>: the interface. A specification may mention only those two. A requirement may mention the environment's phenomena (<code>eh</code>, <code>ev</code>) and the visible outputs (<code>sv</code>). Program and machine work with <code>sv</code> and <code>sh</code>.</p>
<aside class="pitfall">Do not read "hidden" as "secret". It is relative to the other side. The card is hidden from the system (the system only sees the data on it); the roller is hidden from the user. Ask first: who controls this thing? Then: does the other side see it?</aside>`,
      visual: 'wrspm',
      takeaways: [
        `eh and ev are environment-controlled; sv and sh are system-controlled.`,
        `Only ev and sv are shared; they form the interface.`,
        `Hidden and visible are relative to the opposite side.`
      ],
      source: `Lecture 4, slide 8 · Lab 5 (four variables)`
    },
    {
      id: 'patient-monitor',
      title: `Worked example: patient monitoring`,
      html: `<p>The slides fill the whole model for a patient monitoring system. Study how each line sits at its own level.</p>
<table class="tbl"><thead><tr><th>Part</th><th>Content</th></tr></thead><tbody>
<tr><td>R</td><td>Keep track of the patient's heart rate, blood pressure and pulse; warn if the patient's heartbeat stops</td></tr>
<tr><td>W</td><td>A nurse is close enough to hear the buzzer if the patient's heart stops or chest sound fails</td></tr>
<tr><td>S</td><td>Sound the buzzer at the nurse station when sensor input shows no heartbeat</td></tr>
<tr><td>P</td><td>A program that sounds a buzzer</td></tr>
<tr><td>M</td><td>A platform with sensors and actuators</td></tr>
<tr><td>eh</td><td>The nurse</td></tr>
<tr><td>ev</td><td>The sound of the patient's chest/heartbeat (what the sensor picks up)</td></tr>
<tr><td>sv</td><td>The buzzer at the nurse station</td></tr>
<tr><td>sh</td><td>Internal representation of data from the sensor</td></tr>
</tbody></table>
<p>The system never sees the nurse (<code>eh</code>) and the nurse never sees the internal data (<code>sh</code>); they meet only at the heartbeat sound and the buzzer.</p>
<aside class="pitfall">The weak link is W. If the nurse is on a break, the specification is perfectly met and the requirement still fails. False world assumptions are a classic source of real-world failures, so validate them with stakeholders.</aside>`,
      visual: 'wrspm:patient',
      takeaways: [
        `The nurse is eh; the buzzer is sv; sensed heartbeat is ev; internal sensor data is sh.`,
        `The nurse hearing the buzzer is a world assumption, not a system feature.`,
        `A wrong W lets S be satisfied while R fails.`
      ],
      source: `Lecture 4, slide 9 (patient monitoring system)`
    },
    {
      id: 'atm-example',
      title: `Worked example: the ATM`,
      html: `<p>Lab 5 uses the ATM to show the same model in a system you know.</p>
<ul>
<li><strong>R</strong>: a user wants to withdraw money.</li>
<li><strong>W</strong>: the cash loaded in the machine is real, and the user takes the cash that comes out.</li>
<li><strong>S</strong>: the user inserts a card, inputs a PIN, selects an amount; the system dispenses cash only after validation.</li>
<li><strong>P</strong>: the withdrawal software and the frameworks beneath it.</li>
<li><strong>M</strong>: the hardware, such as the cash roller and the lockbox.</li>
</ul>
<table class="tbl"><thead><tr><th>Variable</th><th>ATM item</th></tr></thead><tbody>
<tr><td>eh</td><td>The card itself (what the user wants to use)</td></tr>
<tr><td>ev</td><td>Data from reading the card's magnetic strip; the PIN entered</td></tr>
<tr><td>sv</td><td>Buttons and information displayed on the screen</td></tr>
<tr><td>sh</td><td>The roller inside the machine; obtaining the bank's approval before dispensing</td></tr>
</tbody></table>
<aside class="example">Trace one withdrawal: the card (eh) is read into mag-strip data (ev); the program checks the bank (sh); the screen prompts for an amount (sv); the roller (M, sh) pushes out cash, which the user then takes. Notice the cash itself is visible to the user, so the effect is observable even though the roller is not.</aside>`,
      visual: 'wrspm:atm',
      takeaways: [
        `The card is eh; its mag-strip data and the PIN are ev.`,
        `Buttons and screen are sv; the roller and bank approval are sh.`,
        `The user sees the outcome, not the mechanism behind it.`
      ],
      source: `Lab 5 (ATM example) · Lecture 4`
    },
    {
      id: 'what-to-show',
      title: `What we want to show`,
      html: `<p>WRSPM is not just a filing system; it tells you what a correct development must demonstrate. The slide states two goals:</p>
<ol>
<li>The <strong>specification satisfies the requirements</strong> (given the world assumptions): <code>W</code> and <code>S</code> together entail <code>R</code>.</li>
<li>The <strong>implementation satisfies the specification</strong>, and therefore the requirements: the program running on the machine entails <code>S</code>, so <code>P</code>, <code>M</code> and <code>W</code> together entail <code>R</code>.</li>
</ol>
<p>This yields a clean way to localize defects:</p>
<table class="tbl"><thead><tr><th>Symptom</th><th>Likely broken link</th></tr></thead><tbody>
<tr><td>System matches S but users are unhappy</td><td>W is false, or S does not entail R (a requirements/specification error)</td></tr>
<tr><td>System contradicts S</td><td>P or M (a coding or platform bug)</td></tr>
<tr><td>S mentions internal data</td><td>S has leaked into the solution; restate in ev and sv</td></tr>
</tbody></table>
<aside class="note">The summary slide points to Lecture 5: to actually draw the problem you will use UML, mainly the use case, sequence and class diagrams, with state and activity diagrams as the other two of the five most important.</aside>`,
      visual: null,
      takeaways: [
        `W and S together must entail R.`,
        `P running on M must implement S, which gives R.`,
        `A satisfied S with an unhappy user usually means a false W.`
      ],
      source: `Lecture 4, slide 10 · Gunter, Gunter, Jackson & Zave reference model`
    }
  ],
  practice: [
    {
      id: 'smart-home',
      title: `Lab 5, Q1 — Smart home climate control`,
      source: `Lab 5, Question 1`,
      prompt: `<p>Your team implements a smart home system. The owner gets fully automated climate control in different rooms, using air conditioning, automated curtains, and temperature and humidity sensors. The system should adjust the lighting and temperature of each room to meet the client's criteria.</p><p>Create a simple WRSPM reference model. Try to fill W, R, S, P, M and then eh, ev, sv, sh yourself before revealing each step.</p>`,
      visual: 'wrspm:smart-home',
      steps: [
        {
          q: `Write R and W. What does the owner want, and what must be true of the world?`,
          a: `<p><strong>R</strong>: each room's temperature and lighting match the owner's chosen criteria.</p><p><strong>W</strong>: the air conditioner changes room temperature when it runs; closing curtains reduces sunlight in the room; temperature and humidity sensors sit in the room they report on and measure it correctly; the owner has set criteria that are consistent.</p><p>These are claims about the house, not about software.</p>`
        },
        {
          q: `Write S, P and M.`,
          a: `<p><strong>S</strong>: when a room's sensor reading differs from the owner's setting, switch the AC on or off and open or close the curtains until the reading matches; update the owner display.</p><p><strong>P</strong>: the control program that reads sensors, compares with settings and issues commands.</p><p><strong>M</strong>: the hub or controller hardware, temperature and humidity sensors, AC unit interface and curtain motors.</p>`
        },
        {
          q: `Classify the phenomena: owner's wishes, sensor readings, motor commands, internal data.`,
          a: `<p><strong>eh</strong>: the owner's wishes and the room's actual temperature and sunlight (the system cannot see these directly).</p><p><strong>ev</strong>: temperature and humidity readings; the owner's settings entered in the app.</p><p><strong>sv</strong>: AC on/off, curtain open/close, light level changes, app display.</p><p><strong>sh</strong>: stored schedules, comparison results, internal control state.</p>`
        },
        {
          q: `Name one world assumption that could break the design.`,
          a: `<p>If the sensor is placed next to a window or heat source, it no longer represents the room. Then S is met (the AC reacts to the reading) but R fails (the room is wrong). That is a false W, which is why we record and validate it.</p>`
        }
      ]
    },
    {
      id: 'farm',
      title: `Lab 5, Q2 — Smart farm tracking`,
      source: `Lab 5, Question 2`,
      prompt: `<p>A smart farm embeds a wifi tag under each animal's skin, specific to each animal type. Each animal type has its own feeding, grooming and sleeping place. The system must track every animal's location and notify the barn keepers if an animal is missing or in the wrong place (a cow loose in the hen house).</p><p>(a) Suggest a way to build the system so keepers have full surveillance. (b) Create the WRSPM model.</p>`,
      visual: 'wrspm:farm',
      steps: [
        {
          q: `(a) Propose a system design that gives barn keepers full surveillance.`,
          a: `<p>A <strong>group monitor</strong> shows a map of the farm. Each tag is read by the nearest sensor, and the sensor's known location places a dot for the animal on the map. If an animal crosses a sensor in the wrong section, its dot flashes on and off and a simple peep sounds to grab the keepers' attention.</p>`
        },
        {
          q: `Write R and W.`,
          a: `<p><strong>R</strong>: keepers know where every animal is and are alerted when one is missing or in the wrong place.</p><p><strong>W</strong>: each animal carries exactly one working tag matched to its type; each sensor covers a known zone and the zone-to-animal-type mapping is correct; keepers are near enough to see or hear the alert; animals cannot leave without passing a sensor.</p>`
        },
        {
          q: `Write S, P and M.`,
          a: `<p><strong>S</strong>: when a sensor reports a tag, show a dot on the map at that sensor's location; if the zone is not the tag's allowed zone, flash the dot and sound the peep; if a tag is not seen for a set time, raise a missing alert.</p><p><strong>P</strong>: the tracking and alert program.</p><p><strong>M</strong>: wifi tags, sensors, the monitor and speaker.</p>`
        },
        {
          q: `Classify the phenomena into eh, ev, sv, sh.`,
          a: `<p><strong>eh</strong>: the animals themselves and where they really are; the barn keepers.</p><p><strong>ev</strong>: the tag signal picked up by a sensor.</p><p><strong>sv</strong>: the map dot, flashing, and the peep.</p><p><strong>sh</strong>: the stored tag-to-zone table, last-seen timestamps and internal alert state.</p>`
        }
      ]
    }
  ],
  flashcards: [
    { id: 'l4-f01', front: `What does Why map to in the Why-What-How ladder?`, back: `Business requirements: why the system is needed, such as increase profit by 30%, gain 10% market share or increase the number of customers.`, tag: 'definition' },
    { id: 'l4-f02', front: `What does What map to, and which artifacts express it?`, back: `User requirements: which system features serve the business purpose. Expressed through use cases, sketches and prototypes.`, tag: 'definition' },
    { id: 'l4-f03', front: `What does How map to?`, back: `System requirements: how the system is constructed. They cover functional, non-functional and implementation requirements.`, tag: 'definition' },
    { id: 'l4-f04', front: `Problem domain vs solution domain`, back: `Requirements live in the problem domain (user needs, user language). Specifications live in the solution (computer) domain and constrain how the system solves the problem.`, tag: 'compare' },
    { id: 'l4-f05', front: `What is W in WRSPM?`, back: `World assumptions: universally accepted truths about the environment that affect the system. Hard to capture but crucial.`, tag: 'definition' },
    { id: 'l4-f06', front: `What is R in WRSPM?`, back: `Requirements: what users need, expressed in problem-domain language. Example: the user wants to withdraw money.`, tag: 'definition' },
    { id: 'l4-f07', front: `What is S in WRSPM?`, back: `Specification: how the system meets the need, written in system language as plain actions at the interface. Example: insert card, enter PIN.`, tag: 'definition' },
    { id: 'l4-f08', front: `What is P in WRSPM?`, back: `Program: all the code and underlying frameworks developers write to fulfil the specification.`, tag: 'definition' },
    { id: 'l4-f09', front: `What is M in WRSPM?`, back: `Machine: the hardware platform the program runs on. In the ATM, the money roller and lockbox.`, tag: 'definition' },
    { id: 'l4-f10', front: `eh means...`, back: `Environment hidden from the system: environment-controlled phenomena the system cannot see directly. ATM example: the card.`, tag: 'definition' },
    { id: 'l4-f11', front: `ev means...`, back: `Environment visible to the system: environment-controlled phenomena the system can observe. ATM example: mag-strip data and the PIN.`, tag: 'definition' },
    { id: 'l4-f12', front: `sv means...`, back: `System visible to the environment: system-controlled phenomena the environment can see. ATM example: buttons and screen information.`, tag: 'definition' },
    { id: 'l4-f13', front: `sh means...`, back: `System hidden from the environment: internal system phenomena. ATM example: the roller and the bank approval check.`, tag: 'definition' },
    { id: 'l4-f14', front: `Which two variables form the interface (shared phenomena)?`, back: `ev and sv. The specification may refer only to these; eh and sh are invisible to the other side.`, tag: 'definition' },
    { id: 'l4-f15', front: `What two things do we want to show in WRSPM?`, back: `That the specification satisfies the requirements (with the world assumptions), and that the implementation satisfies both the specification and the requirements.`, tag: 'definition' },
    { id: 'l4-f16', front: `Write the two WRSPM entailments`, back: `W and S entail R. P running on M entails S. Chained: W, P and M together deliver R.`, tag: 'definition' },
    { id: 'l4-f17', front: `Patient monitor: classify the nurse`, back: `eh. The nurse is part of the environment and the system has no direct view of them. Their proximity to the buzzer is a world assumption.`, tag: 'apply' },
    { id: 'l4-f18', front: `Patient monitor: classify the buzzer at the nurse station`, back: `sv. The system controls it and the environment (the nurse) hears it.`, tag: 'apply' },
    { id: 'l4-f19', front: `Patient monitor: classify the internal representation of sensor data`, back: `sh. It is system-controlled and invisible to the nurse or the patient.`, tag: 'apply' },
    { id: 'l4-f20', front: `Patient monitor: classify the heartbeat sound from the chest`, back: `ev. The environment generates it and the sensor makes it visible to the system.`, tag: 'apply' },
    { id: 'l4-f21', front: `Why is a false W dangerous?`, back: `The system can satisfy S perfectly yet still fail R, because the assumption linking sensor input to the real-world event does not hold. Example: the nurse is not near the buzzer.`, tag: 'apply' },
    { id: 'l4-f22', front: `ATM: classify the roller and the bank approval`, back: `Both sh: system-controlled and unseen by the user. The roller is also part of M. The user sees only the cash coming out (an sv effect).`, tag: 'example' },
    { id: 'l4-f23', front: `ATM: classify the card, the mag-strip data, the screen`, back: `Card is eh. Mag-strip data (and the PIN) is ev. Screen information and buttons are sv.`, tag: 'example' },
    { id: 'l4-f24', front: `Requirement vs specification in one line`, back: `A requirement says what is wanted in the world, in the user's language. A specification says what the system does at the interface, in system language.`, tag: 'compare' },
    { id: 'l4-f25', front: `Smart farm: classify the wifi tag signal and the flashing dot`, back: `The tag signal picked up by a sensor is ev. The flashing dot on the map (and the peep) is sv.`, tag: 'example' },
    { id: 'l4-f26', front: `Smart home: classify the sensor reading and the curtain motor command`, back: `The temperature or humidity reading is ev. The command that opens or closes the curtains, and the AC switching, is sv.`, tag: 'example' },
    { id: 'l4-f27', front: `Which UML diagrams are the most important 5?`, back: `Use case, sequence, class, state and activity diagrams. This is the pointer from Lecture 4's summary into Lecture 5.`, tag: 'definition' }
  ],
  quiz: [
    { id: 'l4-q01', kind: 'single', level: 'concept', prompt: `In Why-What-How, which question do business requirements answer?`, options: [`How the system is built`, `Why the system is needed`, `What features it has`, `Who will test it`], answer: 1, why: `Business requirements state the reason for the system (profit, market share). What is user requirements; how is system requirements. Confusing "increase profit by 30%" with a feature is the tempting mistake.` },
    { id: 'l4-q02', kind: 'single', level: 'concept', prompt: `Which artifacts typically express the "What" level?`, options: [`Source code and class libraries`, `Profit targets`, `Use cases, sketches and prototypes`, `Hardware datasheets`], answer: 2, why: `The What level is user-facing: use cases, sketches and prototypes show what the system does for users. Code and hardware belong to How; profit targets belong to Why.` },
    { id: 'l4-q03', kind: 'single', level: 'concept', prompt: `In WRSPM, what does the letter M stand for?`, options: [`Model`, `Maintenance`, `Machine`, `Measurement`], answer: 2, why: `M is the machine: the hardware the program runs on, such as the ATM's roller and lockbox. "Model" is the tempting guess because the lecture is about modeling.` },
    { id: 'l4-q04', kind: 'tf', level: 'concept', prompt: `Requirements are written in the problem domain, while specifications belong to the solution domain.`, answer: true, why: `Lab 5 draws exactly this line: requirements capture user needs in user language; specifications constrain how the computer solves the problem.` },
    { id: 'l4-q05', kind: 'single', level: 'concept', prompt: `Which pair of variables together form the shared interface between environment and system?`, options: [`eh and sh`, `ev and sv`, `eh and ev`, `sv and sh`], answer: 1, why: `ev (environment visible to the system) and sv (system visible to the environment) are the shared phenomena. eh and sh are hidden from the other side.` },
    { id: 'l4-q06', kind: 'single', level: 'theory', prompt: `Which statement correctly describes W in WRSPM?`, options: [`The code and frameworks developers write`, `The user's needs in problem-domain language`, `Assumptions about the world that hold regardless of the system`, `The hardware used to deploy the system`], answer: 2, why: `W is world assumptions: facts that hold in the environment. User needs are R; code is P; hardware is M. W is hard to capture but crucial.` },
    { id: 'l4-q07', kind: 'single', level: 'theory', prompt: `Which phrase defines eh according to the slides?`, options: [`System hidden from the environment`, `Environment visible from the system`, `Environment hidden from the system`, `System visible to the environment`], answer: 2, why: `eh is environment hidden from the system: environment-controlled things the system cannot see, such as the card. The mirror case, system hidden from the environment, is sh.` },
    { id: 'l4-q08', kind: 'multi', level: 'theory', prompt: `Select ALL the things we want to show with WRSPM.`, options: [`The specification satisfies the requirements`, `The implementation satisfies both requirements and specifications`, `Every program statement is hidden from users`, `The machine is cheaper than the program`], answer: [0, 1], why: `The slide names the first two goals. Hiding program statements or comparing cost is not a WRSPM obligation.` },
    { id: 'l4-q09', kind: 'multi', level: 'theory', prompt: `Which of these phenomena are controlled by the ENVIRONMENT?`, options: [`eh`, `ev`, `sv`, `sh`], answer: [0, 1], why: `The e prefix means environment-controlled: eh and ev. sv and sh are controlled by the system. The subscript says who can see it, not who controls it.` },
    { id: 'l4-q10', kind: 'tf', level: 'theory', prompt: `A specification may freely refer to sh phenomena such as the internal roller state.`, answer: false, why: `Specifications are stated at the interface, using shared phenomena (ev and sv). sh is internal to the system and belongs to the program and machine level.` },
    { id: 'l4-q11', kind: 'single', level: 'theory', prompt: `Which statement best captures the relationship between P, M and S?`, options: [`P and M together should satisfy S`, `S should satisfy P and M`, `M replaces the need for P`, `P describes the world that S assumes`], answer: 0, why: `The implementation (program on the machine) must satisfy the specification. The arrow does not run from S to P; S is the target the implementation must meet.` },
    { id: 'l4-q12', kind: 'tf', level: 'theory', prompt: `In the Why-What-How ladder, "gain 10% market share" is a system requirement.`, answer: false, why: `It is a business requirement (Why). System requirements describe how the system is built, such as response times or functions.` },
    { id: 'l4-q13', kind: 'single', level: 'practice', prompt: `In the patient monitoring example, the nurse is classified as:`, options: [`ev`, `sv`, `sh`, `eh`], answer: 3, why: `The nurse sits in the environment and the system never sees them directly: eh. The buzzer they hear is sv.` },
    { id: 'l4-q14', kind: 'single', level: 'practice', prompt: `At an ATM, the data read from the card's magnetic strip is:`, options: [`eh`, `ev`, `sv`, `sh`], answer: 1, why: `Data generated by the environment and visible to the system is ev. The physical card itself is eh; the system only sees the data on it.` },
    { id: 'l4-q15', kind: 'single', level: 'practice', prompt: `A nurse is on a break and never hears the buzzer, although the buzzer sounded exactly as specified. What failed?`, options: [`P, the program was coded wrongly`, `M, the buzzer hardware`, `W, the assumption that the nurse is close enough to hear`, `S, the buzzer was not specified`], answer: 2, why: `S was met and P/M worked, so the world assumption was false. This is the textbook case of W and S not entailing R.` },
    { id: 'l4-q16', kind: 'single', level: 'practice', prompt: `Smart farm: the flashing dot and peep alerting the barn keepers are:`, options: [`sv`, `ev`, `eh`, `sh`], answer: 0, why: `The system produces them and the keepers perceive them, so sv. A tag signal arriving at a sensor would be ev.` },
    { id: 'l4-q17', kind: 'multi', level: 'practice', prompt: `Smart home: select ALL items that are sv (system visible to the environment).`, options: [`The air conditioner turning on`, `The humidity sensor reading`, `The curtains opening`, `The system's stored schedule of room settings`], answer: [0, 2], why: `AC action and curtain movement are system outputs the owner can see. The sensor reading is ev, and the stored schedule is internal (sh).` },
    { id: 'l4-q18', kind: 'single', level: 'practice', prompt: `Which requirement is expressed correctly in problem-domain language?`, options: [`The withdrawal module shall call bank API v2`, `The customer receives the cash they requested`, `The roller shall rotate 180 degrees`, `The cache shall hold the last session`], answer: 1, why: `Only the customer-and-cash statement speaks about the world. The other three describe implementation details (program, machine, internal state) and belong to S, P or M.` },
    { id: 'l4-q19', kind: 'tf', level: 'practice', prompt: `Smart farm: the internal table that maps each tag to its allowed zone, is sh.`, answer: true, why: `It is internal data controlled by the system and not visible to the environment, so sh. If the keepers could browse it on a screen, that displayed view would be sv.` }
  ],
  glossary: [
    { term: `Why-What-How`, def: `Model that separates why a system is needed, what features serve that purpose, and how it is built. Maps to business, user and system requirements.`, related: [`Business requirement`, `User requirement`, `System requirement`] },
    { term: `Business requirement`, def: `High-level reason a system is needed, such as increase profit by 30% or gain 10% market share. The Why level.`, related: [`Why-What-How`] },
    { term: `User requirement`, def: `What users must be able to do, expressed through use cases, sketches and prototypes. The What level.`, related: [`Use case`] },
    { term: `System requirement`, def: `Detailed statements of how the system is constructed: functional, non-functional and implementation requirements. The How level.`, related: [`Specification`] },
    { term: `Problem domain`, def: `The real-world space where user needs and requirements live. Described in the users' language.`, related: [`Solution domain`, `Requirement`] },
    { term: `Solution domain`, def: `The computer-side space where specifications constrain how the system addresses the problem.`, related: [`Problem domain`, `Specification`] },
    { term: `WRSPM`, def: `Reference model separating World assumptions, Requirements, Specification, Program and Machine, with four variables eh, ev, sv, sh.`, related: [`World assumptions`, `Specification`] },
    { term: `World assumptions (W)`, def: `Universally accepted truths about the environment that influence the system and the problem. Hard to capture but crucial.`, related: [`WRSPM`] },
    { term: `Requirement (R)`, def: `What users need, stated in the language of the problem domain; for example, the user wants to withdraw money.`, related: [`Problem domain`] },
    { term: `Specification (S)`, def: `Description of how the system meets the requirement, written in system language at the interface using only shared phenomena.`, related: [`Requirement (R)`, `Interface`] },
    { term: `Program (P)`, def: `The code and underlying frameworks developers write to fulfil the specification.`, related: [`Machine (M)`] },
    { term: `Machine (M)`, def: `The hardware platform on which the program runs; for the ATM, the roller and lockbox.`, related: [`Program (P)`] },
    { term: `Environment`, def: `Everything outside the system that it interacts with: people, devices and the physical world the requirement is about.`, related: [`System`, `Interface`] },
    { term: `System`, def: `The program and machine being built, together with the phenomena they control.`, related: [`Environment`] },
    { term: `Interface`, def: `The shared region where environment and system meet. It consists of ev and sv phenomena.`, related: [`Shared phenomena`] },
    { term: `eh`, def: `Environment hidden from the system: environment-controlled phenomena the system cannot see directly, such as the ATM card.`, related: [`ev`] },
    { term: `ev`, def: `Environment visible to the system: environment-controlled phenomena the system can observe, such as card data and the PIN.`, related: [`eh`, `Shared phenomena`] },
    { term: `sv`, def: `System visible to the environment: system-controlled phenomena the environment perceives, such as buttons and screen output.`, related: [`sh`, `Shared phenomena`] },
    { term: `sh`, def: `System hidden from the environment: internal system phenomena, such as the roller or the bank-approval check.`, related: [`sv`] },
    { term: `Shared phenomena`, def: `The events and states visible to both sides: ev and sv. Specifications are written in terms of these.`, related: [`Interface`] },
    { term: `Entailment`, def: `The relation we must show in WRSPM: W and S together entail R, and P running on M entails S.`, related: [`WRSPM`] },
    { term: `Use case`, def: `A user-facing description of a task a system supports; a typical What-level artifact (see Lecture 5).`, related: [`User requirement`] }
  ]
});
