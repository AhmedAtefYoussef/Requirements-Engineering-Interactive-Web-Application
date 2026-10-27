RE.register({
  id: 'l5', num: 5,
  title: `UML Modeling`,
  short: `UML`,
  slides: 34,
  lede: `UML is the shared visual language teams use to model what a system does and how it is organized. This lecture covers the diagram families and the five that matter most: use case, sequence, class, state and activity diagrams, with exact notation rules the exam loves to test.`,
  outcomes: [
    `Explain why UML helps in requirements engineering`,
    `Place any diagram in a perspective and in structure vs behavior`,
    `Draw and read use case diagrams with include, extend and generalization`,
    `Read sequence diagrams with alt, loop, sync, async, create and destroy`,
    `Read class diagrams: visibility, inheritance, aggregation, composition, multiplicity`
  ],
  sections: [
    {
      id: 'why-uml',
      title: `What UML is and why we use it in RE`,
      html: `<p><span class="term">UML</span> is the Unified Modeling Language. The lecture was given at version 2.5. In requirements engineering it serves as a common visual language for representing how software behaves, how it looks and how users interact with it, so that everyone on the team reads the same picture.</p>
<p>Lab 4 lists the practical benefits:</p>
<ul>
<li>It makes communication clearer and more efficient across analysts, developers, testers and customers.</li>
<li>It lets you <strong>spot potential problems early</strong>, while they are still cheap to fix.</li>
<li>It gives developers a visual roadmap to follow.</li>
</ul>
<p>Sommerville adds that models are <em>abstractions</em>: they omit detail on purpose. Depending on the use, a model may be informal (to stimulate discussion), correct but incomplete (to document an existing system), or complete and precise (to generate code).</p>
<aside class="note">Lab 4 opens with a Talabat case: a food-delivery app is a convenient mental system for practicing actors (customer, restaurant, courier, payment provider) and use cases (browse menu, place order, track order). Use any app you know the same way.</aside>`,
      visual: null,
      takeaways: [
        `UML is a common visual language; the course uses version 2.5.`,
        `Benefits: clearer communication, early problem detection, a roadmap for developers.`,
        `Models are deliberate abstractions; detail level depends on purpose.`
      ],
      source: `Lecture 5, slide 3 · Lab 4 (Why UML in RE; Talabat case) · Sommerville ch.5 intro`
    },
    {
      id: 'perspectives',
      title: `Four perspectives on a system`,
      html: `<p>Slide 4 groups models by what they look at. Each perspective answers a different question about the same system.</p>
<table class="tbl"><thead><tr><th>Perspective</th><th>Models...</th><th>Typical diagrams</th></tr></thead><tbody>
<tr><td>External</td><td>The context: the system and its environment</td><td>Context and use case diagrams</td></tr>
<tr><td>Interaction</td><td>Interaction between system and environment, or between components</td><td>Use case, sequence</td></tr>
<tr><td>Structural</td><td>Organization of the system or structure of the data</td><td>Class (also component, package, deployment)</td></tr>
<tr><td>Behavioral</td><td>Dynamic behavior and how the system responds to events</td><td>Activity, state</td></tr>
</tbody></table>
<p>Sommerville separates behavior triggered by <strong>data</strong> arriving (business systems, such as billing; use activity diagrams) from behavior triggered by <strong>events</strong> (real-time systems, such as a phone switch; use state diagrams).</p>
<aside class="pitfall">A diagram can belong to more than one perspective. Use case diagrams are both external (they draw the system boundary) and interaction (actors talk to the system). On a perspective question, match the question being asked: boundary, conversation, shape of data, or reaction to events.</aside>`,
      visual: 'perspectives',
      takeaways: [
        `External, interaction, structural, behavioral: four lenses on one system.`,
        `Structural models static organization; behavioral models dynamic response.`,
        `Data-driven behavior suits activity diagrams; event-driven suits state diagrams.`
      ],
      source: `Lecture 5, slide 4 · Sommerville ch.5 (perspectives; data- vs event-driven)`
    },
    {
      id: 'taxonomy',
      title: `The UML diagram family`,
      html: `<p>UML diagrams split into two families on slide 5.</p>
<table class="tbl"><thead><tr><th>Family</th><th>Diagrams</th></tr></thead><tbody>
<tr><td><strong>Structure</strong> (what exists)</td><td>Class, component, object, deployment, package</td></tr>
<tr><td><strong>Behavior</strong> (what happens)</td><td>Activity, use case, state machine, and the <em>interaction</em> diagrams: sequence and communication</td></tr>
</tbody></table>
<p>Interaction diagrams are a sub-branch of behavior, which is why sequence and communication diagrams sit under "interaction". Out of these, the slides single out the <strong>five most important</strong>:</p>
<ol>
<li><strong>Use case</strong>: interactions between a system and its environment.</li>
<li><strong>Sequence</strong>: interactions between actors and the system, and between system components.</li>
<li><strong>Class</strong>: object classes and the associations between them.</li>
<li><strong>State</strong>: how the system reacts to internal and external events.</li>
<li><strong>Activity</strong>: the activities in a process or in data processing.</li>
</ol>
<aside class="note">A 2007 survey cited by Sommerville found these five were what most practitioners actually use. Lecture slides give use case, sequence and class the deepest coverage; state and activity are a research slide.</aside>`,
      visual: 'uml-tree',
      takeaways: [
        `Structure: class, component, object, deployment, package.`,
        `Behavior: activity, use case, state machine, interaction (sequence, communication).`,
        `Five most important: use case, sequence, class, state, activity.`
      ],
      source: `Lecture 5, slides 5–6 · Sommerville ch.5`
    },
    {
      id: 'usecase-basics',
      title: `Use case diagrams: building blocks`,
      html: `<p>A use case diagram models interactions between a system and its external actors and visualizes the <em>functional requirements</em>. It contains four ingredients, and the slides give a rule for each.</p>
<ul>
<li><strong>System</strong>: anything you are actually developing (a website, mobile app, business process or software component). Draw it as a rectangle with its name.</li>
<li><strong>Actor</strong>: anyone or anything that interacts with the system (a person, another system, a device, an organization). A <strong>primary actor</strong> initiates the interaction and is drawn on the <strong>left</strong>. A <strong>secondary actor</strong> reacts to the system and is drawn on the <strong>right</strong>.</li>
<li><strong>Use case</strong>: an action or scenario of a task, drawn as an ellipse <strong>inside</strong> the system rectangle.</li>
<li><strong>Relationships</strong>: lines and arrows connecting these.</li>
</ul>
<aside class="pitfall">Two actor rules are exam favorites. Actors are placed <strong>outside</strong> the system boundary, and they are <strong>categorical, not named</strong>: write "Customer", never "John". Also, use cases go inside the boundary, never outside.</aside>
<aside class="example">Library app: Librarian (primary, left) is associated with Log In, Manage Catalog and Issue Book (inside the rectangle). Payment Terminal (secondary, right) is associated with Collect Fine, because the terminal is reactive: it responds when the system asks for payment.</aside>`,
      visual: null,
      takeaways: [
        `System is a rectangle; use cases are ellipses inside; actors stand outside.`,
        `Primary actors initiate and sit on the left; secondary actors react and sit on the right.`,
        `Name actors by category (Customer), never by person (John).`
      ],
      source: `Lecture 5, slides 7–13 · Lab 4 (UML diagrams, use case)`
    },
    {
      id: 'usecase-relationships',
      title: `Use case relationships: include, extend, generalization`,
      html: `<p>Slide 14 defines four relationships. Memorize the arrow directions.</p>
<table class="tbl"><thead><tr><th>Relationship</th><th>Meaning</th><th>Drawing</th></tr></thead><tbody>
<tr><td>Association</td><td>Basic communication between an actor and a use case</td><td>Plain line</td></tr>
<tr><td>«include»</td><td>Not initiated by an actor. Every time the base use case runs, the included one runs too (mandatory)</td><td>Dashed arrow pointing <strong>toward the included</strong> use case, labelled include</td></tr>
<tr><td>«extend»</td><td>Not initiated by an actor. When the base runs, the extending use case <strong>can happen sometimes</strong> (optional, conditional)</td><td>Dashed arrow pointing <strong>toward the base</strong> use case, labelled extend</td></tr>
<tr><td>Generalization</td><td>Parent and child: the child has some parent characteristics plus its own</td><td>Solid line with hollow triangle at the parent</td></tr>
</tbody></table>
<p><strong>Extension points</strong> are named locations in the base use case where an extension may insert behavior, for example "Apply coupon" at the payment step in Place Order. They tell the reader exactly where and under what condition the optional behavior enters.</p>
<aside class="pitfall">The classic mix-up: both include and extend are dashed arrows. Include points <em>to the included</em> (the base needs it). Extend points <em>to the base</em> (the extension depends on the base; the base does not know about it). Test: can the base finish without it? If no, include; if yes, extend.</aside>
<aside class="example">InstaPay case (slides 15-18): Customer (primary) and Bank (secondary). Check Balance, Make Transfer and Pay Bills each &laquo;include&raquo; Log In; Send Receipt &laquo;extend&raquo; Make Transfer; Pay Electricity Bill specializes Pay Bills. The diagram shows who can do what, not the order of steps.</aside><aside class="example">Every withdrawal must verify the PIN, so Withdraw Cash «include» Verify PIN. Printing a receipt is optional, so Print Receipt «extend» Withdraw Cash.</aside>`,
      visual: 'usecase:instapay',
      takeaways: [
        `Include: mandatory, arrow from base to included.`,
        `Extend: optional, arrow from extension to base, with extension points.`,
        `Generalization: child specializes parent; triangle points at the parent.`
      ],
      source: `Lecture 5, slides 14–18 · Sommerville ch.5.2.1 · UML 2.5 standard`
    },
    {
      id: 'sequence',
      title: `Sequence diagrams`,
      html: `<p>A sequence diagram models interactions between system components and shows the <strong>order</strong> of those interactions within a use case: the flow of events and message flow. Time runs top to bottom.</p>
<table class="tbl"><thead><tr><th>Element</th><th>Meaning</th></tr></thead><tbody>
<tr><td>Object</td><td>A class or object showing how it behaves in the system (box at the top)</td></tr>
<tr><td>Actor</td><td>Someone or something interacting with the system</td></tr>
<tr><td>Lifeline</td><td>Dashed vertical line; time passing downward</td></tr>
<tr><td>Activation box</td><td>Narrow rectangle on the lifeline: time an object needs to complete a task</td></tr>
<tr><td>Alt</td><td>Frame with alternatives between two or more message sequences</td></tr>
<tr><td>Loop</td><td>Frame for repetition under a condition</td></tr>
<tr><td>Synchronous message</td><td>Sender must wait for a response; call and reply both shown</td></tr>
<tr><td>Return message</td><td>The reply to a message (dashed arrow)</td></tr>
<tr><td>Asynchronous message</td><td>Sender continues without waiting; only the call is shown</td></tr>
<tr><td>Create message</td><td>Creates a new object, labelled «create»</td></tr>
<tr><td>Delete/destroy</td><td>Destroys an object; ends with an X on its lifeline</td></tr>
</tbody></table>
<aside class="example">Banking app transfer: Customer asks the App to transfer; App asks the Account to check the balance (sync). Alt frame: [sufficient funds] Account debits, App confirms; [insufficient funds] App shows "Insufficient funds" and ends. The alternative handles the case slide 24 asks for.</aside>
<aside class="pitfall">Horizontal position carries no time meaning; only vertical order does. Do not confuse lifeline (the participant's existence on the diagram) with activation (when it is actively working).</aside>`,
      visual: 'sequence',
      takeaways: [
        `Time flows downward along lifelines; activation boxes show active periods.`,
        `Sync waits and shows a reply; async does not wait and shows only the call.`,
        `Use alt for alternatives like insufficient funds, and loop for repetition.`
      ],
      source: `Lecture 5, slides 19–24 · Sommerville ch.5.2.2 · UML 2.5`
    },
    {
      id: 'class-diagram',
      title: `Class diagrams: classes, visibility, inheritance`,
      html: `<p>A class diagram is used when developing object-oriented systems. It shows classes, their attributes and methods, the associations between classes, and the number of objects in each association.</p>
<p>A <span class="term">class</span> is a template for objects (Animal, Doctor, Customer). The box has three parts: name, attributes, methods. An <strong>attribute</strong> is a property or field of each instance (name, ID, age) and starts with a visibility symbol. A <strong>method</strong> is a behavior feature: an operation or function.</p>
<table class="tbl"><thead><tr><th>Symbol</th><th>Visibility</th><th>Who can access</th></tr></thead><tbody>
<tr><td><code>-</code></td><td>Private</td><td>Its own class only</td></tr>
<tr><td><code>+</code></td><td>Public</td><td>Other classes and subclasses</td></tr>
<tr><td><code>#</code></td><td>Protected</td><td>Same class or subclasses</td></tr>
<tr><td><code>~</code></td><td>Package/default</td><td>Classes in the same package</td></tr>
</tbody></table>
<p>By convention attributes are often private or protected, and methods are often public.</p>
<p><strong>Inheritance (generalization)</strong> is the parent-child relationship: a child has some of the parent's characteristics plus its own. Subclasses connect to the parent with an <strong>open (hollow) arrow</strong> pointing at the parent. An <em>abstract</em> class, such as User, is not instantiated directly; you instantiate its children (Student, Admin).</p>
<aside class="pitfall">Symbol check: <code>#</code> is protected (visible to subclasses), not "package". <code>~</code> is package. And the inheritance arrow points to the parent, the more general class.</aside>`,
      visual: 'class-diagram',
      takeaways: [
        `Class box: name, attributes, methods. Visibility: - private, + public, # protected, ~ package.`,
        `Inheritance uses an open arrow pointing to the parent.`,
        `Abstract classes are not instantiated; their children are.`
      ],
      source: `Lecture 5, slides 25–28 · Sommerville ch.5.3 · UML 2.5`
    },
    {
      id: 'class-relationships',
      title: `Aggregation, composition and multiplicity`,
      html: `<p>Both aggregation and composition are whole-part relationships, drawn with a diamond at the <strong>whole</strong> end. The difference is lifecycle.</p>
<table class="tbl"><thead><tr><th></th><th>Aggregation</th><th>Composition</th></tr></thead><tbody>
<tr><td>Diamond</td><td>Hollow</td><td>Filled</td></tr>
<tr><td>Strength</td><td>Weak "has-a"</td><td>Strong ownership</td></tr>
<tr><td>Parts without the whole</td><td>Can exist independently, may be shared</td><td>Cannot; deleted with the whole</td></tr>
<tr><td>Example</td><td>Team has Players; Library has Books</td><td>Order has OrderLines; House has Rooms</td></tr>
</tbody></table>
<p><strong>Multiplicity</strong> puts a numerical constraint on an association. Read it from one class toward the other: the number beside class B says how many B objects relate to <em>one</em> object of A.</p>
<table class="tbl"><thead><tr><th>Notation</th><th>Meaning</th></tr></thead><tbody>
<tr><td><code>0..1</code></td><td>Zero or one</td></tr>
<tr><td><code>n</code> (e.g. 3)</td><td>A specific number</td></tr>
<tr><td><code>0..*</code> or <code>*</code></td><td>Zero to many</td></tr>
<tr><td><code>1..*</code></td><td>One to many</td></tr>
<tr><td><code>m..n</code> (e.g. 2..5)</td><td>A specific range</td></tr>
</tbody></table>
<aside class="example">Reading exercise: Customer 1 ----- 0..* Order means one customer places zero or more orders. Order 1 ----- 1..* OrderLine means every order has at least one line. Doctor 1..* ----- 1..* Patient: a doctor treats one or more patients, and a patient sees one or more doctors.</aside>
<aside class="pitfall">Test for composition: if you delete the whole, must the parts disappear? Deleting an Order deletes its OrderLines (composition). Deleting a Library does not destroy the books in the world (aggregation).</aside>`,
      visual: 'class-diagram',
      takeaways: [
        `Hollow diamond is aggregation (parts independent); filled diamond is composition (parts die with the whole).`,
        `Diamonds sit on the whole's side.`,
        `Multiplicity: 0..1, n, 0..*, 1..*, m..n.`
      ],
      source: `Lecture 5, slides 29–31 · Sommerville ch.5.3.3 · UML 2.5`
    },
    {
      id: 'state-activity',
      title: `State and activity diagrams`,
      html: `<p>The lecture leaves these two as a research task. Sommerville provides the core ideas.</p>
<p><strong>State diagram (state machine)</strong> shows how a system or object responds to internal and external events. It assumes a finite number of <span class="term">states</span>. <span class="term">Events</span> (stimuli) cause <span class="term">transitions</span> between states. A transition is labelled <code>event [guard] / action</code>: the guard is a condition that must be true for the transition to fire. A filled circle marks the start, a bull's-eye the end, rounded rectangles are states. State diagrams do not show data flow, and a <em>superstate</em> hides substates to avoid state explosion.</p>
<aside class="example">Microwave: Waiting goes to Full power on the Full power event; Start from there goes to Operation only when the door is closed; Door open from Operation goes to Disabled. Start with the door open is not an allowed transition.</aside>
<p><strong>Activity diagram</strong> shows the activities of a process or of data processing, from start to end.</p>
<ul>
<li><strong>Initial node</strong> (filled circle) and <strong>final node</strong> (bull's-eye).</li>
<li><strong>Actions/activities</strong> in rounded rectangles; arrows show flow.</li>
<li><strong>Decision</strong> (diamond) with guards such as [Dangerous] and [Not dangerous].</li>
<li><strong>Fork and join</strong> (solid bar): fork starts parallel flows; join waits for all incoming flows.</li>
<li><strong>Swimlanes</strong> (partitions) show who is responsible for each action.</li>
</ul>
<aside class="pitfall">Pick by question. "What state is the vending machine in after a coin?" is a state diagram. "What are the parallel steps of order fulfilment?" is an activity diagram. State is about one thing's lifecycle; activity is about workflow.</aside>`,
      visual: 'state-activity',
      takeaways: [
        `State diagram: states, events, transitions, guards; event-driven.`,
        `Activity diagram: initial/final nodes, actions, decisions, fork/join, swimlanes.`,
        `State is the lifecycle of one thing; activity is a process flow.`
      ],
      source: `Lecture 5, slide 32 (research) · Sommerville ch.5.4 · UML 2.5`
    }
  ],
  practice: [
    {
      id: 'library',
      title: `Lab 4 — University library app`,
      source: `Lab 4, Exercise 1`,
      prompt: `<p>Design a use case diagram for the <strong>librarian side</strong> of a university library app. A librarian must log in first. The librarian can:</p><ul><li>Manage the catalog by adding or removing books. Adding a book requires checking that the ISBN is not already in the catalog.</li><li>Issue a book to a member, after checking that the member is active.</li><li>Receive a returned book. If it is late, the librarian may collect a fine through an external Payment terminal.</li><li>Generate loan reports, with an optional PDF export.</li></ul><p>The Head Librarian can do everything a librarian can and can also approve book removals.</p>`,
      visual: 'usecase:library',
      steps: [
        {
          q: `Identify the system boundary and the actors. Which are primary, which secondary?`,
          a: `<p>System: <strong>Library App</strong>. Actors, all outside the boundary and categorical: <strong>Librarian</strong> (primary, left), <strong>Head Librarian</strong> (primary, left) and <strong>Payment Terminal</strong> (secondary, right, because it only reacts when asked to take a payment).</p><p>Head Librarian <strong>generalizes</strong> Librarian: hollow triangle pointing at Librarian, so the Head inherits every association.</p>`
        },
        {
          q: `List the use cases and decide which ones the Librarian is directly associated with.`,
          a: `<p>Inside the boundary: Log In, Manage Catalog, Add Book, Remove Book, Issue Book, Receive Returned Book, Generate Loan Report, plus Check ISBN, Check Member Active, Collect Fine, Export PDF and Approve Removal.</p><p>The Librarian is associated with Log In, Manage Catalog (with Add Book and Remove Book as its parts), Issue Book, Receive Returned Book and Generate Loan Report. Check ISBN and Check Member Active are not initiated by an actor.</p>`
        },
        {
          q: `Which relationships are «include»? Give the arrow direction.`,
          a: `<p>Mandatory sub-behavior is include, arrow from base to included:</p><ul><li>Add Book «include» Check ISBN (every addition checks the ISBN).</li><li>Issue Book «include» Check Member Active.</li><li>The actor-facing use cases that need login include Log In (or show Log In as a precondition, as the exercise says "must log in first").</li></ul>`
        },
        {
          q: `Which relationships are «extend»? Give the arrow direction and the condition.`,
          a: `<p>Optional or conditional behavior is extend, arrow from the extension to the base:</p><ul><li>Collect Fine «extend» Receive Returned Book, condition [book is late]; Payment Terminal is associated with Collect Fine.</li><li>Export PDF «extend» Generate Loan Report, condition [user requests PDF].</li></ul><p>The base use cases work without these, so extend is correct.</p>`
        },
        {
          q: `Add the Head Librarian's extra power and check for common errors.`,
          a: `<p>Head Librarian is associated with <strong>Approve Removal</strong>, and Remove Book depends on it: model it as Remove Book «include» Approve Removal for the Head's flow, or as Approve Removal «extend» Remove Book if approval is only required sometimes. State your assumption.</p><p>Checklist: actors outside, use cases inside; actors named by role; include arrows to the included; extend arrows to the base; generalization triangle at Librarian.</p>`
        }
      ]
    }
  ],
  flashcards: [
    { id: 'l5-f01', front: `What does UML stand for and which version did the lecture use?`, back: `Unified Modeling Language, version 2.5. It is a common visual language for modeling software behavior, structure and interactions.`, tag: 'definition' },
    { id: 'l5-f02', front: `Why use UML in requirements engineering? (Lab 4)`, back: `Communication becomes clearer and more efficient, potential issues are spotted early, and developers get a visual roadmap to follow.`, tag: 'definition' },
    { id: 'l5-f03', front: `Name the four modeling perspectives`, back: `External (context), interaction (system and environment or components), structural (organization of system or data), behavioral (dynamic response to events).`, tag: 'definition' },
    { id: 'l5-f04', front: `UML structure diagrams`, back: `Class, component, object, deployment and package diagrams. They show what exists in the system.`, tag: 'definition' },
    { id: 'l5-f05', front: `UML behavior diagrams`, back: `Activity, use case, state machine and interaction diagrams. The interaction diagrams are sequence and communication.`, tag: 'definition' },
    { id: 'l5-f06', front: `The five most important UML diagrams`, back: `Use case, sequence, class, state and activity diagrams.`, tag: 'definition' },
    { id: 'l5-f07', front: `What does a use case diagram show?`, back: `The interactions between a system and its environment, visualizing the functional requirements of the system.`, tag: 'definition' },
    { id: 'l5-f08', front: `What is a system in a use case diagram?`, back: `Anything you are actually developing: a website, mobile app, business process or software component. Drawn as a named rectangle.`, tag: 'definition' },
    { id: 'l5-f09', front: `Primary vs secondary actor`, back: `Primary initiates the interaction and sits on the left. Secondary is reactive to the system and sits on the right, such as a payment terminal.`, tag: 'compare' },
    { id: 'l5-f10', front: `Two placement rules for actors`, back: `Actors are placed outside the system boundary, and they are categorical roles (Customer) not individual names (John).`, tag: 'definition' },
    { id: 'l5-f11', front: `Where do use cases go?`, back: `Inside the system rectangle. Each represents an action or scenario of a task within the system.`, tag: 'definition' },
    { id: 'l5-f12', front: `«include»: meaning and arrow`, back: `Every time the base runs, the included use case runs too. Dashed arrow points toward the included use case, labelled include.`, tag: 'definition' },
    { id: 'l5-f13', front: `«extend»: meaning and arrow`, back: `When the base runs, the extension can happen sometimes. Dashed arrow points toward the base use case, labelled extend.`, tag: 'definition' },
    { id: 'l5-f14', front: `Include vs extend test`, back: `Can the base use case complete without it? No: include (arrow base to included). Yes: extend (arrow extension to base).`, tag: 'compare' },
    { id: 'l5-f15', front: `Generalization in use case diagrams`, back: `Parent-child relation: the child has some parent characteristics plus its own. Solid line with hollow triangle pointing at the parent.`, tag: 'definition' },
    { id: 'l5-f16', front: `What is an extension point?`, back: `A named place in the base use case where an extend use case may add behavior, together with the condition under which it does so.`, tag: 'definition' },
    { id: 'l5-f17', front: `What does a sequence diagram show?`, back: `The order of interactions in a use case: message flow between actors, the system and its components, with time running downward.`, tag: 'definition' },
    { id: 'l5-f18', front: `Lifeline vs activation box`, back: `The lifeline is the dashed vertical line showing time passing for a participant. The activation box is the period it is actively completing a task.`, tag: 'compare' },
    { id: 'l5-f19', front: `Synchronous vs asynchronous message`, back: `Synchronous: sender waits for a response, both call and reply are shown. Asynchronous: sender continues without waiting, only the call is shown.`, tag: 'compare' },
    { id: 'l5-f20', front: `Create and destroy messages`, back: `Create makes a new object, labelled «create». Delete or destroy ends an object, marked by an X at the end of its lifeline.`, tag: 'definition' },
    { id: 'l5-f21', front: `What do alt and loop frames do?`, back: `Alt gives options between two or more message sequences, selected by guards. Loop repeats a sequence while a condition holds.`, tag: 'definition' },
    { id: 'l5-f22', front: `Banking transfer sequence: how is insufficient funds modeled?`, back: `With an alt frame: one branch [sufficient funds] debits and confirms; the other [insufficient funds] returns an error message to the customer.`, tag: 'apply' },
    { id: 'l5-f23', front: `Class, attribute and method`, back: `A class is a template for objects. Attributes are the properties or fields of each instance. Methods are its operations or behavior.`, tag: 'definition' },
    { id: 'l5-f24', front: `Four visibility symbols`, back: `Minus private (own class only), plus public, hash protected (class and subclasses), tilde package (same package).`, tag: 'definition' },
    { id: 'l5-f25', front: `Typical visibility of attributes and methods`, back: `Attributes are often private or protected. Methods are often public.`, tag: 'definition' },
    { id: 'l5-f26', front: `Inheritance notation and abstract class`, back: `Children connect to the parent with an open arrow pointing at the parent. An abstract class (such as User) is not instantiated; its children are.`, tag: 'definition' },
    { id: 'l5-f27', front: `Aggregation vs composition`, back: `Both are whole-part with the diamond at the whole. Aggregation: hollow diamond, parts can live independently. Composition: filled diamond, parts die with the whole.`, tag: 'compare' },
    { id: 'l5-f28', front: `Read: Customer 1 --- 0..* Order`, back: `One customer is related to zero or more orders. The star end counts orders per single customer.`, tag: 'apply' },
    { id: 'l5-f29', front: `Multiplicity forms`, back: `0..1 zero or one, n a specific number, 0..* zero to many, 1..* one to many, m..n a specific range.`, tag: 'definition' },
    { id: 'l5-f30', front: `State diagram vs activity diagram`, back: `State diagram: states of one thing and event-triggered transitions. Activity diagram: flow of actions in a process, with decisions and parallel forks.`, tag: 'compare' },
    { id: 'l5-f31', front: `Activity diagram notation`, back: `Initial and final nodes, actions, decision diamonds with guards, fork and join bars for parallelism, swimlanes for responsibility.`, tag: 'definition' },
    { id: 'l5-f32', front: `Library exercise: Collect Fine to Receive Returned Book`, back: `Extend, with the arrow from Collect Fine to Receive Returned Book, condition [late]. Payment Terminal is the secondary actor on the right.`, tag: 'example' }
  ],
  quiz: [
    { id: 'l5-q01', kind: 'single', level: 'concept', prompt: `Which diagram family does a class diagram belong to?`, options: [`Behavior`, `Interaction`, `Structure`, `Communication`], answer: 2, why: `Class, component, object, deployment and package diagrams are structure diagrams. Behavior covers activity, use case, state machine and interaction diagrams.` },
    { id: 'l5-q02', kind: 'single', level: 'concept', prompt: `Which diagram shows the interactions between a system and its environment?`, options: [`Class diagram`, `State diagram`, `Use case diagram`, `Deployment diagram`], answer: 2, why: `The use case diagram models the system, its actors and their interactions. Class diagrams show structure; state diagrams show reactions to events.` },
    { id: 'l5-q03', kind: 'tf', level: 'concept', prompt: `Actors in a use case diagram are drawn inside the system boundary.`, answer: false, why: `Actors are outside the system; only use cases go inside the rectangle.` },
    { id: 'l5-q04', kind: 'single', level: 'concept', prompt: `The behavioral perspective models:`, options: [`Organization of data`, `The system context`, `Dynamic behavior and responses to events`, `Hardware deployment only`], answer: 2, why: `The behavioral perspective is about dynamic behavior and reactions to events and data. Organization of data is structural; the context is external.` },
    { id: 'l5-q05', kind: 'multi', level: 'concept', prompt: `Select ALL of the "five most important" UML diagrams.`, options: [`Use case`, `Deployment`, `Sequence`, `Package`], answer: [0, 2], why: `The five are use case, sequence, class, state and activity. Deployment and package are valid UML diagrams but not on the list.` },
    { id: 'l5-q06', kind: 'single', level: 'concept', prompt: `Which visibility symbol means protected?`, options: [`-`, `+`, `~`, `#`], answer: 3, why: `# is protected (class and subclasses). - is private, + public, ~ package.` },
    { id: 'l5-q07', kind: 'single', level: 'theory', prompt: `In a use case diagram, where does the dashed «include» arrow point?`, options: [`Toward the included use case`, `Toward the base use case`, `Toward the primary actor`, `Toward the system boundary`], answer: 0, why: `Include points from the base to the included use case. Extend is the one that points toward the base; swapping them is the commonest error.` },
    { id: 'l5-q08', kind: 'single', level: 'theory', prompt: `Which description fits «extend»?`, options: [`Always executed with the base`, `Can happen sometimes when the base runs`, `Initiated by a secondary actor`, `A parent-child relationship`], answer: 1, why: `Extend is optional or conditional. "Always executed" describes include; parent-child describes generalization.` },
    { id: 'l5-q09', kind: 'single', level: 'theory', prompt: `What is the difference between a primary and a secondary actor?`, options: [`Primary is a person; secondary is a system`, `Primary initiates the interaction (left); secondary is reactive (right)`, `Primary is inside the system; secondary is outside`, `Primary has a name; secondary is categorical`], answer: 1, why: `Initiation and reactivity decide it, not whether the actor is a person. Both are outside the system and both are categorical.` },
    { id: 'l5-q10', kind: 'multi', level: 'theory', prompt: `Select ALL correct statements about sequence diagrams.`, options: [`A synchronous message makes the sender wait for a response`, `An asynchronous message shows only the call`, `An activation box shows the whole existence of an object`, `A create message is labelled «create»`], answer: [0, 1, 3], why: `Sync waits, async shows only the call, create is labelled «create». The activation box shows only when an object is busy; the lifeline shows its existence.` },
    { id: 'l5-q11', kind: 'single', level: 'theory', prompt: `Which pair correctly distinguishes aggregation and composition?`, options: [`Aggregation filled diamond, parts die with whole`, `Composition hollow diamond, parts independent`, `Aggregation hollow diamond, parts independent; composition filled diamond, parts die with whole`, `They differ only in colour, not in lifecycle`], answer: 2, why: `Hollow means weak, independent parts; filled means strong ownership with parts bound to the whole's lifecycle. Options one and two swap the symbols.` },
    { id: 'l5-q12', kind: 'tf', level: 'theory', prompt: `In UML inheritance, the open arrow points from the parent class to the child.`, answer: false, why: `It points from the child to the parent: the subclass points at the more general class.` },
    { id: 'l5-q13', kind: 'tf', level: 'theory', prompt: `Use case diagrams show the order in which the steps of a use case are performed.`, answer: false, why: `They show who can do what. Step order and message flow belong to sequence diagrams or the use case text.` },
    { id: 'l5-q14', kind: 'single', level: 'practice', prompt: `An ATM design says: every withdrawal must verify the PIN. Which relationship models this?`, options: [`Verify PIN «extend» Withdraw Cash`, `Withdraw Cash «include» Verify PIN`, `Verify PIN generalizes Withdraw Cash`, `Customer is composed of Verify PIN`], answer: 1, why: `Mandatory sub-behavior is include, with the arrow from Withdraw Cash (base) to Verify PIN. Extend would imply PIN verification is optional.` },
    { id: 'l5-q15', kind: 'single', level: 'practice', prompt: `A food app lets the customer optionally add a tip when paying. Which relationship fits Add Tip and Pay Order?`, options: [`Pay Order «include» Add Tip`, `Add Tip «extend» Pay Order`, `Add Tip generalizes Pay Order`, `Add Tip is a secondary actor`], answer: 1, why: `Tipping is optional, so Add Tip extends Pay Order and the arrow points to Pay Order, the base. Include would make tipping mandatory.` },
    { id: 'l5-q16', kind: 'single', level: 'practice', prompt: `Library exercise: where does the "Payment terminal" appear in the diagram?`, options: [`Inside the boundary as a use case`, `On the left as a primary actor`, `Outside the boundary on the right as a secondary actor`, `As a subclass of Librarian`], answer: 2, why: `It is an external system that reacts when asked to take a payment, so it is a secondary actor outside the boundary on the right.` },
    { id: 'l5-q17', kind: 'single', level: 'practice', prompt: `Read this multiplicity: Customer 1 ---- 0..* Order. Which statement is correct?`, options: [`A customer must have at least one order`, `An order can belong to many customers`, `One customer may have zero or more orders`, `Each customer has exactly zero orders`], answer: 2, why: `0..* at the Order end means zero to many orders per single customer. "At least one" would be 1..*.` },
    { id: 'l5-q18', kind: 'single', level: 'practice', prompt: `Deleting an Order must also delete all its OrderLines. Which relationship fits?`, options: [`Aggregation`, `Composition`, `Generalization`, `Dependency`], answer: 1, why: `Parts that cannot exist without the whole indicate composition (filled diamond). Aggregation applies when parts live on independently, as books do when a library closes.` },
    { id: 'l5-q19', kind: 'single', level: 'practice', prompt: `You need to show the order of messages between the login screen, controller and database. Which diagram?`, options: [`Class diagram`, `Sequence diagram`, `Use case diagram`, `Package diagram`], answer: 1, why: `Message order over time between components is exactly what a sequence diagram models. A class diagram shows static structure only.` },
    { id: 'l5-q20', kind: 'multi', level: 'practice', prompt: `In the library exercise, select ALL relationships that are «extend».`, options: [`Collect Fine to Receive Returned Book`, `Export PDF to Generate Loan Report`, `Add Book to Check ISBN`, `Issue Book to Check Member Active`], answer: [0, 1], why: `Fine collection (only when late) and PDF export (optional) are conditional. Checking the ISBN and member status are mandatory, so they are include.` },
    { id: 'l5-q21', kind: 'single', level: 'practice', prompt: `A banking sequence diagram must handle a transfer when funds are insufficient. Which construct models the choice?`, options: [`Loop frame`, `Alt frame with guards`, `Create message`, `Destroy message`], answer: 1, why: `Alt gives alternative message sequences selected by guards such as [sufficient funds]. A loop repeats; create and destroy manage objects.` },
    { id: 'l5-q22', kind: 'tf', level: 'practice', prompt: `In the library exercise, the Head Librarian is modeled as a generalization of the Librarian, so the Head can do everything the Librarian can.`, answer: true, why: `Generalization means the child inherits the parent's associations and adds its own (Approve Removal). Strictly the Head is the child and Librarian the parent, with the triangle at Librarian.` }
  ],
  glossary: [
    { term: `UML`, def: `Unified Modeling Language: a standard visual language for modeling software structure, behavior and interactions. Version 2.5 in this course.`, related: [`Diagram`] },
    { term: `Perspective`, def: `A viewpoint on a system: external, interaction, structural or behavioral. Each perspective suggests particular diagram types.`, related: [`UML`] },
    { term: `Structure diagram`, def: `UML diagram family showing what exists: class, component, object, deployment and package diagrams.`, related: [`Behavior diagram`] },
    { term: `Behavior diagram`, def: `UML diagram family showing what happens: activity, use case, state machine and interaction diagrams.`, related: [`Structure diagram`] },
    { term: `Use case diagram`, def: `Diagram of the interactions between a system and its environment, visualizing functional requirements through actors, use cases and relationships.`, related: [`Actor`, `Use case`] },
    { term: `System boundary`, def: `The rectangle that separates what is being developed (use cases inside) from the outside world (actors outside).`, related: [`Actor`] },
    { term: `Actor`, def: `Anything or anyone interacting with the system, placed outside the boundary and named by role (Customer), not by individual.`, related: [`Primary actor`, `Secondary actor`] },
    { term: `Primary actor`, def: `Actor that initiates the interaction with the system. Drawn on the left of the system.`, related: [`Secondary actor`] },
    { term: `Secondary actor`, def: `Actor that reacts to the system, such as a payment terminal. Drawn on the right of the system.`, related: [`Primary actor`] },
    { term: `Use case`, def: `An action or scenario of a task within the system, drawn as an ellipse inside the system boundary.`, related: [`Use case diagram`] },
    { term: `Association`, def: `Basic communication relationship, drawn as a line between an actor and a use case (or between classes in a class diagram).`, related: [`Include`, `Extend`] },
    { term: `Include`, def: `Mandatory relationship: every time the base runs, the included use case also runs. Dashed arrow points toward the included use case.`, related: [`Extend`] },
    { term: `Extend`, def: `Optional relationship: the extending use case may happen sometimes when the base runs. Dashed arrow points toward the base use case.`, related: [`Include`, `Extension point`] },
    { term: `Extension point`, def: `A named location in a base use case where an extend use case can insert optional behavior when its condition holds.`, related: [`Extend`] },
    { term: `Generalization`, def: `Parent-child relationship: the child has some parent characteristics plus its own. Drawn with a hollow triangle at the parent.`, related: [`Inheritance`] },
    { term: `Sequence diagram`, def: `Interaction diagram showing the order of messages between actors, the system and components along lifelines, with time running downward.`, related: [`Lifeline`, `Activation box`] },
    { term: `Lifeline`, def: `The dashed vertical line under an object or actor showing time passing downward.`, related: [`Activation box`] },
    { term: `Activation box`, def: `Narrow rectangle on a lifeline showing the time an object needs to complete a task.`, related: [`Lifeline`] },
    { term: `Synchronous message`, def: `Message where the sender waits for a response. Both the call and the reply are shown.`, related: [`Asynchronous message`] },
    { term: `Asynchronous message`, def: `Message where the sender continues without waiting. Only the call is shown.`, related: [`Synchronous message`] },
    { term: `Alt frame`, def: `Sequence diagram frame offering alternative message sequences chosen by guard conditions, such as sufficient or insufficient funds.`, related: [`Sequence diagram`] },
    { term: `Class diagram`, def: `Structure diagram showing classes with attributes and methods, plus associations, generalization, aggregation, composition and multiplicity.`, related: [`Class`, `Multiplicity`] },
    { term: `Class`, def: `Template for objects, drawn as a box with name, attributes and methods (for example Animal, Doctor, Customer).`, related: [`Visibility`] },
    { term: `Visibility`, def: `Access marker before a member: minus private, plus public, hash protected, tilde package.`, related: [`Class`] },
    { term: `Inheritance`, def: `Subclass reuses the parent's characteristics and adds its own. Drawn with an open arrow pointing to the parent; an abstract parent is not instantiated.`, related: [`Generalization`] },
    { term: `Aggregation`, def: `Whole-part relationship with a hollow diamond at the whole. Parts can exist independently of the whole.`, related: [`Composition`] },
    { term: `Composition`, def: `Strong whole-part relationship with a filled diamond at the whole. Parts cannot exist without the whole.`, related: [`Aggregation`] },
    { term: `Multiplicity`, def: `Numerical constraint on an association end: 0..1, n, 0..*, 1..* or m..n.`, related: [`Class diagram`] },
    { term: `State diagram`, def: `Behavior diagram of states, event-triggered transitions and guards; shows how a system reacts to internal and external events.`, related: [`Activity diagram`] },
    { term: `Activity diagram`, def: `Behavior diagram of a process: initial and final nodes, actions, decisions, fork and join, and swimlanes.`, related: [`State diagram`] }
  ]
});
