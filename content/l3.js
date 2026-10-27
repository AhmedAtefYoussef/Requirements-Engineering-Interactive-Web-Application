RE.register({
  id: 'l3', num: 3,
  title: 'Negotiation, Triage & Prioritization',
  short: 'Prioritization',
  slides: 27,
  lede: `Resources are always smaller than the wish list, and every stakeholder believes their requirements matter most. This lecture gives you the vocabulary and seven techniques (In or Out, pairwise, three-level, MoSCoW, $100, Wiegers' value/cost/risk matrix, AHP) to decide what gets built first and to defend that decision.`,
  outcomes: [
    'Explain why requirements must be prioritized and negotiated, and name the criteria and participants involved',
    'Distinguish dependencies implemented in sequence from those implemented together',
    'Apply In or Out, pairwise comparison, three-level (importance x urgency), MoSCoW and the $100 method to a scenario',
    'Compute a priority with the value/cost/risk matrix formula',
    'Build, normalize and read an AHP matrix to obtain a priority vector'
  ],
  sections: [
    {
      id: 'why-prioritize',
      title: 'Why prioritize and negotiate at all',
      html: `<p>Every project has limited time, money and people, yet stakeholders always ask for more than can be built. <strong>Prioritization</strong> decides the order in which requirements are implemented. <strong>Negotiation</strong> is the conversation that resolves the disagreements about that order. Lecture 3 treats them together because you cannot prioritize without stakeholders agreeing, and you cannot agree without some shared way of ranking.</p>
<p>The slide gives the core problem in one sentence: <em>every stakeholder is convinced that their requirements are the most important ones.</em> Left to themselves, customers rate almost everything high (Wiegers reports roughly 85% high, 10% medium, 5% low). If everything is top priority, nothing has been prioritized.</p>
<p>What prioritization buys you:</p>
<ul>
<li>Effort goes first to what delivers the most benefit within the limited resources.</li>
<li>When the schedule slips, the team already knows what to cut instead of panicking and descoping at random.</li>
<li>You avoid building a feature and only later discovering nobody needed it.</li>
</ul>
<aside class="note">Triage is borrowed from emergency medicine: when you cannot treat everyone, sort the cases quickly into those who need help now, those who can wait, and those not worth the scarce resources. In RE, triage means sorting requirements the same way for a release or timebox.</aside>
<aside class="pitfall">Do not confuse the two words. Prioritization produces a ranking or grouping. Negotiation is the human process of reaching agreement about it. A technique such as $100 supports both, but a spreadsheet alone does not settle a conflict.</aside>`,
      visual: null,
      takeaways: [
        'Resources are limited and every stakeholder thinks theirs matter most, so ranking and agreement are unavoidable.',
        'If all requirements are labelled high, you have not prioritized anything.',
        'Prioritization ranks requirements; negotiation resolves the stakeholder disagreements about the ranking.'
      ],
      source: 'Lecture 3, slides 3-6 · Wiegers ch.16 · Sommerville 4.5'
    },
    {
      id: 'levels-participants-criteria',
      title: 'Levels, participants, criteria and dependencies',
      html: `<p><strong>At each level.</strong> Prioritize at every level of the requirements (business goals, features, user requirements, functional requirements). Rank items at the <em>same</em> abstraction level: compare features with features and functional requirements with functional requirements, never a goal against a single field validation. A sensible order is features first, then the requirements inside the high-priority features.</p>
<p><strong>Who participates.</strong> Various stakeholders contribute: customers, project sponsors, project management and developers. Customers tell you value; developers tell you cost, difficulty and risk; sponsors and management arbitrate.</p>
<p><strong>Agree on criteria first.</strong> Before anyone rates anything, agree what &ldquo;important&rdquo; means. The slide's sample criteria:</p>
<ul>
<li>customer value and business value</li>
<li>risk, cost and implementation difficulty</li>
<li>time to market</li>
<li>regulatory compliance</li>
<li>competitive advantage</li>
<li>contractual commitments</li>
</ul>
<p><strong>Dependencies.</strong> A requirement's rank is not free to move independently. The slides show two kinds:</p>
<table class="tbl"><thead><tr><th>Kind</th><th>Meaning</th><th>Slide example</th></tr></thead><tbody>
<tr><td>Implemented in sequence</td><td>B only makes sense after A exists</td><td>You cannot pay for something that is not in the cart, but you can pay by bank transfer for products that are in the cart. Cart first, payment after.</td></tr>
<tr><td>Implemented together</td><td>A and B must ship in the same release</td><td>Accepting credit-card transactions without handling rejected or stolen cards is incomplete. Normal flow and exception handling go together.</td></tr>
</tbody></table>
<aside class="example"><strong>Example.</strong> Suppose &ldquo;Undo&rdquo; ranks high and &ldquo;Redo&rdquo; ranks low. Redo is meaningless without Undo, but Undo alone still works, so Redo can wait. Reverse it (Redo high, Undo low) and the high-priority item depends on a low-priority one: the dependency forces Undo up.</aside>
<aside class="pitfall">A high-priority requirement that depends on a lower-priority one is a red flag. Dependencies override raw scores. Regulatory items are effectively automatic high, and some low-value items are built early for architectural reasons.</aside>`,
      visual: null,
      takeaways: [
        'Rank at one consistent level and agree the criteria before rating anything.',
        'Customers supply value; developers supply cost, difficulty and risk; sponsors and management arbitrate.',
        'Dependencies run in sequence or together and can override the raw ranking.'
      ],
      source: 'Lecture 3, slides 4-6 · Wiegers ch.16'
    },
    {
      id: 'negotiation-triage',
      title: 'Negotiation, conflicts and choosing a technique',
      html: `<p>The slides name three arenas in which conflicts must be negotiated:</p>
<ol>
<li><strong>Stakeholders:</strong> conflicts over goals, features and requirements.</li>
<li><strong>Projects:</strong> conflicts over cost, benefit, risk and time (several projects compete for the same people and budget).</li>
<li><strong>Customers and suppliers:</strong> conflicts around resources.</li>
</ol>
<p>Practical guidance from the books: negotiate top-down (goals, then features, then requirements); keep a regular negotiation forum; record the <em>rationale</em> for each decision; and name a single decision maker for when agreement cannot be reached. Sommerville notes that if some stakeholders feel unheard they may undermine the process, so compromise has to be visible.</p>
<p><strong>Games people play.</strong> Stakeholders inflate priorities (&ldquo;I need all of these&rdquo;, &ldquo;high, super-high, incredibly high&rdquo;). Two traps: decibel prioritization (the loudest voice wins) and threat prioritization (&ldquo;do it or I escalate&rdquo;). Deflate with probing questions: Is there another way to meet the need? What is the consequence of deferring it? What happens to the business objectives if it is delayed a few months? Is it worth delaying everything else of the same priority?</p>
<p><strong>The technique ladder.</strong> The lecture lists the techniques roughly from cheapest to heaviest:</p>
<table class="tbl"><thead><tr><th>Technique</th><th>Output</th><th>Best when</th></tr></thead><tbody>
<tr><td>In or Out</td><td>binary decision</td><td>cutting to the bare minimum for release 1</td></tr>
<tr><td>Pairwise comparison and rank order</td><td>full ranking</td><td>at most a couple dozen items</td></tr>
<tr><td>Three-level scale</td><td>High / Medium / Low</td><td>quick coarse sorting for one release</td></tr>
<tr><td>MoSCoW</td><td>Must / Should / Could / Won't</td><td>shared vocabulary for scope</td></tr>
<tr><td>$100</td><td>numeric weights per item</td><td>group voting, showing strength of preference</td></tr>
<tr><td>Value, cost, risk (Wiegers matrix, QFD)</td><td>computed priority number</td><td>you need cost and risk, not just opinion</td></tr>
<tr><td>AHP (bonus)</td><td>priority vector summing to 1</td><td>subjective multi-criteria decisions</td></tr>
</tbody></table>
<aside class="note">Moving down the table adds rigor and effort. Use the lightest technique that settles the argument, and escalate only when stakeholders still disagree.</aside>`,
      visual: null,
      takeaways: [
        'Conflicts arise among stakeholders (goals, features, requirements), among projects (cost, benefit, risk, time), and between customers and suppliers (resources).',
        'Record rationale and name a decision maker; use probing questions to deflate inflated priorities.',
        'Techniques range from binary In or Out up to computed methods like the Wiegers matrix and AHP.'
      ],
      source: 'Lecture 3, slides 7-11 · Wiegers ch.16 · Sommerville 4.5'
    },
    {
      id: 'in-out-pairwise',
      title: 'In or Out, pairwise comparison and rank order',
      html: `<p><strong>In or Out</strong> is the simplest method: for each requirement the group makes a binary decision, in or out, while constantly referring back to the project's business objectives. What stays &ldquo;in&rdquo; is the bare minimum for the first release. Afterwards, return to the requirements previously marked &ldquo;out&rdquo; and run the process again for the next release.</p>
<p><strong>Pairwise comparison and rank order.</strong> Apply it to a set of features, user stories or other requirements of the <em>same type</em>. Compare every pair, pick the higher-priority one each time, count the wins, and sort. The result is a unique rank order.</p>
<aside class="example"><strong>Worked example.</strong> Four requirements A, B, C, D need 4 x 3 / 2 = 6 comparisons. Suppose the group decides: A beats B, A beats C, A beats D, B beats C, B beats D, D beats C. Wins: A = 3, B = 2, D = 1, C = 0. Rank order: A, B, D, C.</aside>
<p><strong>Limits.</strong> The number of comparisons is n(n-1)/2, so 10 items need 45, 24 items need 276 and 36 need 630. That is why the slide says it is not practical beyond a couple of dozen requirements. Also, ranking everything is overkill: you will not implement them one at a time, you will batch them by release or timebox. Grouping requirements into features, or small sets with similar priority or that must be implemented together, is sufficient.</p>
<aside class="pitfall">Pairwise votes can contradict themselves (A beats B, B beats C, C beats A). A tally then gives ties and a meaningless ranking. AHP, later in this lecture, was designed to measure and tolerate that kind of inconsistency.</aside>`,
      visual: 'pairwise',
      takeaways: [
        'In or Out is binary: keep the bare minimum for release 1, then revisit rejected items later.',
        'Pairwise comparison needs n(n-1)/2 judgments, so it works only up to about a couple dozen items.',
        'Batch requirements by release instead of ranking every single one.'
      ],
      source: 'Lecture 3, slides 12-14 · Wiegers ch.16'
    },
    {
      id: 'three-level-scale',
      title: 'Three-level scale and the urgency grid',
      html: `<p>The familiar <strong>High / Medium / Low</strong> scale is quick, but on its own it is &ldquo;not so useful&rdquo;: people disagree on what High means and everything drifts to High. The slide's fix is to use <strong>two dimensions, importance and urgency</strong>, and to derive the level from the pair. Always judge against the forthcoming release or timebox.</p>
<table class="tbl"><thead><tr><th></th><th>Urgent</th><th>Not urgent</th></tr></thead><tbody>
<tr><th>Important</th><td><strong>High</strong>: needed in the next release, or a contract or compliance deadline</td><td><strong>Medium</strong>: matters, but can wait for a later release</td></tr>
<tr><th>Not important</th><td><strong>Don't do</strong>: urgent but low value, often someone's political pressure. Scrub it or set it low</td><td><strong>Low</strong>: neither important nor urgent</td></tr>
</tbody></table>
<aside class="example"><strong>Read the grid.</strong> &ldquo;A new tax rule takes effect next month and the system must comply&rdquo;: important and urgent, so High. &ldquo;A reporting dashboard we want by the release after next&rdquo;: important, not urgent, so Medium. &ldquo;The VP wants a new colour theme by Friday&rdquo; with no link to business objectives: urgent but not important, so don't spend effort. &ldquo;Optional animation on the about page&rdquo;: Low.</aside>
<p><strong>Multipass.</strong> If too many items land in High, split High into high, higher and highest; the &ldquo;highest&rdquo; group becomes your top set and the rest merge with Medium. Remember to record priority as an attribute, to state whether sub-requirements inherit it, and to have stakeholders agree what each level means.</p>
<aside class="pitfall">The scale is subjective and coarse. It says nothing about cost, so a High item may be enormous. It also tempts people to call urgency-by-shouting &ldquo;importance&rdquo;. Keep the two dimensions separate.</aside>`,
      visual: 'urgency-grid',
      takeaways: [
        'Plain High/Medium/Low is weak; combining importance and urgency gives a defensible level.',
        'Important and urgent is High; important not urgent is Medium; urgent not important is dropped; neither is Low.',
        'If too many items are High, split High into high, higher and highest.'
      ],
      source: 'Lecture 3, slides 15-16 · Wiegers ch.16 (Covey grid)'
    },
    {
      id: 'moscow',
      title: 'MoSCoW',
      html: `<p><strong>MoSCoW</strong> sorts requirements into four named groups (the lower-case o's are only there to make the word pronounceable). The slide's definitions:</p>
<ul>
<li><strong>Must:</strong> the requirement must be satisfied for the solution to be considered a success.</li>
<li><strong>Should:</strong> the requirement is important and should be included in the solution if possible, but it is not mandatory to success.</li>
<li><strong>Could:</strong> a desirable capability, but one that could be deferred or eliminated. Implement it only if time and resources permit.</li>
<li><strong>Won't:</strong> a requirement that will not be implemented at this time but could be included in a future release.</li>
</ul>
<aside class="example"><strong>Apply it.</strong> Online bookshop, first release. &ldquo;Customers can pay for items in the cart&rdquo;: Must (no sale without it). &ldquo;Customers can save a wish list&rdquo;: Should. &ldquo;Gift-wrapping option&rdquo;: Could. &ldquo;Augmented-reality preview of books on a shelf&rdquo;: Won't, for this release. Test: if you delete the item and the product still counts as a success, it is not a Must.</aside>
<aside class="pitfall"><strong>Won't is ambiguous.</strong> It means &ldquo;not now&rdquo; (as the slide says, maybe a future release), not &ldquo;never&rdquo;. Always write &ldquo;Won't this release&rdquo;. Wiegers also criticizes MoSCoW for giving no rationale and for stakeholders marking nearly everything Must. Ask for a reason for every Must.</aside>
<p>MoSCoW is essentially a four-level scale with a better vocabulary. Its strength is that it fixes a shared meaning for each bucket; its weakness is that it still carries no numbers, no cost and no order inside a bucket. That gap is exactly what the $100 method and the value/cost/risk matrix fill.</p>`,
      visual: 'moscow-board',
      takeaways: [
        'Must means the solution fails without it; Should is important but not essential; Could is optional; Won\'t is not now.',
        'Won\'t means deferred, not never; always say which release.',
        'Everything tends to become Must, so demand a rationale per Must.'
      ],
      source: 'Lecture 3, slide 17 · Wiegers ch.16 (IIBA MoSCoW)'
    },
    {
      id: 'hundred-dollar',
      title: 'The $100 method',
      html: `<p>Each team (or each participant) gets 100 imaginary dollars and uses them to &ldquo;buy&rdquo; requirements. The more dollars you put on a requirement, the higher its priority. The budget is fixed: when the money is gone, nothing else can be bought, at least for the release you are focusing on.</p>
<p>The slide's suggested variant: give <strong>each participant their own $100</strong>, then add up the dollars each requirement received. Dividing the total by the number of participants gives the average, which is easier to compare.</p>
<aside class="example"><strong>Mini example.</strong> Three people allocate across R1, R2, R3. P1: 60/30/10. P2: 20/50/30. P3: 40/20/40. Totals: R1 = 120, R2 = 100, R3 = 80 (sum 300 = 3 x 100). Averages: 40, 33.3, 26.7. Order: R1, R2, R3.</aside>
<p><strong>Why it works.</strong> The cap forces trade-offs, and the amount shows <em>strength</em> of preference, not just order. Large spreads between participants (one person gives $40, another $5) mark exactly the requirements to discuss.</p>
<aside class="pitfall"><strong>Gaming.</strong> A participant can put all 100 dollars on a single favourite, which would never be an acceptable system by itself, and with many participants a coordinated group can push their pet feature. The method also considers only perceived value: it ignores cost. Three features each worth $10 that cost the same as one feature worth $15 are the better buy, but $100 alone will not tell you.</aside>
<p>Mitigations: cap how much one item may receive, collect allocations privately before revealing them, always follow the totals with a &ldquo;why&rdquo; discussion, and cross-check with cost (see the next section). The donation-system practice walks through the full six-user table.</p>`,
      visual: 'hundred-dollar',
      takeaways: [
        'Each participant spends exactly $100; add up (or average) the dollars each requirement receives.',
        'It shows strength of preference but ignores cost and can be gamed by dumping all dollars on one item.',
        'Large disagreement between participants is the signal to discuss why.'
      ],
      source: 'Lecture 3, slide 18 · 100$ Method sheet · Wiegers ch.16'
    },
    {
      id: 'value-cost-risk',
      title: 'Value, cost and risk: the Wiegers matrix and QFD',
      html: `<p>The $100 method sees only value. <strong>Wiegers' prioritization matrix</strong> (an adaptation of <strong>Quality Function Deployment, QFD</strong>) also weighs what an item costs and how risky it is. The idea (Karlsson and Ryan): the best items give the largest fraction of total value for the smallest fraction of total cost and risk.</p>
<p><strong>Steps.</strong></p>
<ol>
<li>List features at the same abstraction level (up to a few dozen).</li>
<li>Customers rate <strong>relative benefit</strong> (1-9): the value if the feature is present.</li>
<li>Customers rate <strong>relative penalty</strong> (1-9): the damage if it is absent. Value is benefit plus penalty, because a &ldquo;checkbox&rdquo; feature may give little benefit but a big penalty when missing.</li>
<li>Total value = benefit x benefit weight + penalty x penalty weight. Value % = that item's share of the sum of all total values.</li>
<li>Developers rate <strong>relative cost</strong> (1 = quick and cheap, 9 = expensive) and <strong>relative risk</strong> (1-9, technical risk of not getting it right). Convert each to Cost % and Risk % by share of the column total.</li>
<li>Compute the priority and sort descending.</li>
</ol>
<p><strong>Formula:</strong> <code>priority = Value% / (Cost% x costWeight + Risk% x riskWeight)</code>. With equal weights this is value% / (cost% + risk%). A weight of 0 drops that term. Higher priority number means do it earlier.</p>
<aside class="example"><strong>Worked example.</strong> Weights: benefit 2, penalty 1, cost 1, risk 0.5.
<table class="tbl"><thead><tr><th>Feature</th><th>Ben</th><th>Pen</th><th>Total value</th><th>Value %</th><th>Cost</th><th>Cost %</th><th>Risk</th><th>Risk %</th><th>Priority</th></tr></thead><tbody>
<tr><td>A</td><td>8</td><td>4</td><td>20</td><td>33.9</td><td>3</td><td>23.1</td><td>2</td><td>18.2</td><td>1.05</td></tr>
<tr><td>B</td><td>5</td><td>8</td><td>18</td><td>30.5</td><td>2</td><td>15.4</td><td>1</td><td>9.1</td><td>1.53</td></tr>
<tr><td>C</td><td>9</td><td>3</td><td>21</td><td>35.6</td><td>8</td><td>61.5</td><td>8</td><td>72.7</td><td>0.36</td></tr>
</tbody></table>
Totals: value 59, cost 13, risk 11. B: 30.5 / (15.4 x 1 + 9.1 x 0.5) = 30.5 / 19.95 = 1.53. A: 33.9 / (23.1 + 9.1) = 1.05. C: 35.6 / (61.5 + 36.4) = 0.36. Order: B, A, C. C has the highest value yet comes last because it is expensive and risky.</aside>
<p>The book's own check: feature &ldquo;Print a material safety data sheet&rdquo; has benefit 2, penalty 4, cost 1, risk 1, so total value = 2x2 + 4x1 = 8, giving value 5.2%, cost 2.7%, risk 3.0% and priority 5.2 / (2.7 + 1.5) = 1.24 (the book prints 1.22 because of rounding).</p>
<aside class="pitfall">Customers rate benefit and penalty; developers rate cost and risk. Do not let one group rate everything. &ldquo;Risk&rdquo; here is technical risk of the implementation, not business risk. Do not read too much into tiny priority differences; group similar scores, and hide the intermediate percentage columns so nobody games the arithmetic.</aside>
<p><strong>QFD</strong> is the rigorous parent: it relates customer value to features, treating value as the benefit of having the feature plus the penalty of not having it. Few software teams use full QFD; the matrix above is its lightweight form.</p>`,
      visual: 'wiegers-matrix',
      takeaways: [
        'Priority = Value% / (Cost% x cost weight + Risk% x risk weight); high value, low cost, low risk wins.',
        'Value combines relative benefit (having it) and relative penalty (not having it).',
        'Customers rate benefit and penalty; developers rate cost and technical risk.'
      ],
      source: 'Lecture 3, slides 19-20 · Wiegers ch.16, Table 16-1 · QFD (Cohen)'
    },
    {
      id: 'ahp',
      title: 'Bonus method: Analytic Hierarchy Process',
      html: `<p><strong>AHP</strong> suits complex decisions with several criteria and subjective judgments (feelings, preference, satisfaction). Instead of asking for one big ranking, it asks for many small pairwise comparisons and turns them into weights that sum to 1.</p>
<p><strong>Scale.</strong> 1 = equal importance, 3 = moderate, 5 = strong, 7 = very strong, 9 = extremely strong. The values 2, 4, 6 and 8 are halfway preferences. If A is 3 times as important as B, then B versus A is the reciprocal 1/3. The diagonal is always 1.</p>
<p><strong>Procedure.</strong></p>
<ol>
<li>Build the pairwise comparison matrix (fill the upper half, mirror reciprocals below).</li>
<li>Normalize: divide each cell by its column sum.</li>
<li>Average each row. The row averages form the priority vector (the slide calls it EV, the eigenvector estimate).</li>
</ol>
<aside class="example"><strong>Lecture example.</strong> Criteria: Stakeholder Commitment (SC), Financial (F), Strategic (S), Risk (R).
<table class="tbl"><thead><tr><th></th><th>SC</th><th>F</th><th>S</th><th>R</th></tr></thead><tbody>
<tr><th>SC</th><td>1</td><td>1/5</td><td>1/9</td><td>1</td></tr>
<tr><th>F</th><td>5</td><td>1</td><td>1</td><td>5</td></tr>
<tr><th>S</th><td>9</td><td>1</td><td>1</td><td>5</td></tr>
<tr><th>R</th><td>1</td><td>1/5</td><td>1/5</td><td>1</td></tr>
<tr><th>Sum</th><td>16</td><td>2.4</td><td>2.31</td><td>12</td></tr>
</tbody></table>
Normalize the first column: 1/16 = 0.06, 5/16 = 0.31, 9/16 = 0.56, 1/16 = 0.06 (sums to 1). Normalizing every column and averaging each row gives EV: SC 0.07, F 0.39, S 0.46, R 0.08. Strategic is most important, then Financial; Risk and Stakeholder Commitment are minor, with Risk slightly ahead.</aside>
<aside class="note"><strong>Extension from the literature, not on the slides.</strong> Full AHP adds a consistency check. If A is 5x B and B is 4x C, then A should be about 20x C. Consistency ratio CR = CI / RI with CI = (lambda max - n) / (n - 1); CR below about 0.10 is acceptable. The lecture matrix scores CR near 0.02 (consistent); Lab 3's matrix scores about 0.33, a warning to revisit those judgments.</aside>
<aside class="pitfall">AHP needs n(n-1)/2 judgments per matrix, so it does not scale to long lists, and the numbers are only as good as the opinions. Do not forget the reciprocals: writing 3 in both mirrored cells breaks the method. Every normalized column must sum to 1, and the row averages must also sum to 1; if not, you made an arithmetic slip.</aside>`,
      visual: 'ahp:lecture',
      takeaways: [
        'Scale 1/3/5/7/9 with 2/4/6/8 halfway; the lower triangle holds reciprocals; the diagonal is 1.',
        'Procedure: pairwise matrix, divide each cell by its column sum, average each row to get the priority vector.',
        'The lecture example gives Stakeholder Commitment 0.07, Financial 0.39, Strategic 0.46, Risk 0.08.'
      ],
      source: 'Lecture 3, slides 21-26 · Lab 3 · Saaty AHP (consistency check is an extension)'
    }
  ],
  practice: [
    {
      id: 'lab3',
      title: 'Lab 3 — Movie rating app',
      source: 'Lab 3',
      prompt: `<p>Your team builds a movie rating application for movie viewers and critics. Users check their favorite movies and are notified when a favorite director makes a new movie. Critics write reviews about any movie and users rate those reviews.</p>
<ol>
<li>Suggest at least 7 functional and non-functional requirements.</li>
<li>Prioritize 4 requirements.</li>
<li>Use AHP on the top 4 to find the lowest priority.</li>
</ol>
<p>Requirement list used in the lab:</p>
<ul>
<li>FR1: Users can mark a director or cast member as favourite.</li>
<li>FR2: Critics can post reviews about movies.</li>
<li>FR3: Users can rate the critics' reviews.</li>
<li>FR4: Users are notified when a favourite director or cast makes a new movie.</li>
<li>FR5: Critics can view their reviews' ratings.</li>
<li>NFR1: The application is cross platform (Windows, iOS, Android).</li>
<li>NFR2: The application has a geo-cache for faster response.</li>
</ul>`,
      visual: 'ahp:lab3',
      steps: [
        {
          q: 'Which four requirements go into the AHP, and why would you pick them?',
          a: `<p>The lab chooses <strong>FR1, FR2, FR4 and NFR1</strong>. They cover favourites, review posting, notifications and platform reach, which are the core of the app described in the brief. FR3, FR5 and NFR2 are left out of this round (they can be ranked later or in another pass).</p>`
        },
        {
          q: 'Build the 4x4 pairwise matrix. What numbers go in the FR1 row and the FR4 row?',
          a: `<p>Rows and columns in the order FR1, FR2, FR4, NFR1. Upper-triangle judgments: FR1 vs FR2 = 1/3, FR1 vs FR4 = 2, FR1 vs NFR1 = 5, FR2 vs FR4 = 3, FR2 vs NFR1 = 4, FR4 vs NFR1 = 1/4. Lower triangle holds the reciprocals.</p>
<table class="tbl"><thead><tr><th></th><th>FR1</th><th>FR2</th><th>FR4</th><th>NFR1</th></tr></thead><tbody>
<tr><th>FR1</th><td>1</td><td>1/3</td><td>2</td><td>5</td></tr>
<tr><th>FR2</th><td>3</td><td>1</td><td>3</td><td>4</td></tr>
<tr><th>FR4</th><td>1/2</td><td>1/3</td><td>1</td><td>1/4</td></tr>
<tr><th>NFR1</th><td>1/5</td><td>1/4</td><td>4</td><td>1</td></tr>
</tbody></table>
<p>Check: FR2 vs FR1 = 3 is the reciprocal of FR1 vs FR2 = 1/3; FR4 vs FR1 = 1/2 reciprocates FR1 vs FR4 = 2.</p>`
        },
        {
          q: 'Compute the four column sums.',
          a: `<p>Decimal form (.33, .5, .2, .25) gives:</p>
<ul>
<li>FR1 column: 1 + 3 + 0.5 + 0.2 = <strong>4.7</strong></li>
<li>FR2 column: 0.333 + 1 + 0.333 + 0.25 = <strong>1.917</strong> (the slide shows 1.91)</li>
<li>FR4 column: 2 + 3 + 1 + 4 = <strong>10</strong></li>
<li>NFR1 column: 5 + 4 + 0.25 + 1 = <strong>10.25</strong></li>
</ul>`
        },
        {
          q: 'Normalize the matrix (divide each cell by its column sum). What is the normalized FR1 row?',
          a: `<p>FR1 row: 1/4.7 = 0.213, 0.333/1.917 = 0.174, 2/10 = 0.200, 5/10.25 = 0.488. Row sum 1.075.</p>
<table class="tbl"><thead><tr><th></th><th>FR1</th><th>FR2</th><th>FR4</th><th>NFR1</th><th>Row sum</th></tr></thead><tbody>
<tr><th>FR1</th><td>0.213</td><td>0.174</td><td>0.200</td><td>0.488</td><td>1.075</td></tr>
<tr><th>FR2</th><td>0.638</td><td>0.522</td><td>0.300</td><td>0.390</td><td>1.850</td></tr>
<tr><th>FR4</th><td>0.106</td><td>0.174</td><td>0.100</td><td>0.024</td><td>0.405</td></tr>
<tr><th>NFR1</th><td>0.043</td><td>0.130</td><td>0.400</td><td>0.098</td><td>0.671</td></tr>
</tbody></table>
<p>Each column sums to 1.000, which is your arithmetic check.</p>`
        },
        {
          q: 'Average each row to get the priority vector. Which requirement is lowest and which is highest?',
          a: `<p>Divide each row sum by 4: FR1 = 1.075/4 = <strong>0.269</strong>, FR2 = 1.850/4 = <strong>0.463</strong>, FR4 = 0.405/4 = <strong>0.101</strong>, NFR1 = 0.671/4 = <strong>0.168</strong>. They add up to about 1.</p>
<p>Ranking: FR2 (0.463) &gt; FR1 (0.269) &gt; NFR1 (0.168) &gt; FR4 (0.101). The <strong>lowest priority is FR4</strong> (notifications) and the <strong>highest is FR2</strong> (critics posting reviews), which makes sense: without reviews there is nothing to rate or to notify about.</p>
<aside class="note">Extra insight: the judgments are not fully consistent (FR1 is 5x NFR1 and NFR1 is 4x FR4, which would imply FR1 is about 20x FR4, but the matrix says 2x). A consistency check would flag this; the ranking still reads sensibly.</aside>`
        }
      ]
    },
    {
      id: 'donation',
      title: '$100 method: Donation management system',
      source: '100$ Method sheet',
      prompt: `<p>A nonprofit is building a donation management system with very limited development resources. They want the most valuable part first. Six team members each receive a hypothetical $100. The customer's features:</p>
<ul>
<li>RE1: Donor History Tracking</li>
<li>RE2: Automated Email Reminders</li>
<li>RE3: Detailed Reporting</li>
<li>RE4: Volunteer Management</li>
<li>RE5: Donor Segmentation</li>
<li>RE6: Integration with Payment Gateways</li>
<li>RE7: Customizable Thank You Notes</li>
<li>RE8: Event Management</li>
</ul>
<p>Fill the table (users U1-U6, Value = sum, Average), use &ldquo;Why?&rdquo; to explain the ratings and reach team consensus, then decide how to combine MoSCoW with the $100 approach.</p>`,
      visual: 'hundred-dollar:donation',
      steps: [
        {
          q: 'How do you run the exercise with 6 users?',
          a: `<ol>
<li>Show the eight features and agree what each means and the criterion (value to the nonprofit in the first release).</li>
<li>Each of U1-U6 privately writes dollars next to RE1-RE8. Each column of a user must total exactly 100 (zero is allowed).</li>
<li>Collect all sheets and reveal them together so nobody anchors on others.</li>
<li>Sum each row across the six users (the Value column), then divide by 6 for the Average.</li>
</ol>
<p>The grand total of all values must be 6 x 100 = 600, a quick arithmetic check.</p>`
        },
        {
          q: 'Here are illustrative allocations (invented for practice). Compute Value and Average for each RE.',
          a: `<p>Allocations in the order U1, U2, U3, U4, U5, U6:</p>
<table class="tbl"><thead><tr><th>Req</th><th>U1</th><th>U2</th><th>U3</th><th>U4</th><th>U5</th><th>U6</th><th>Value</th><th>Average</th></tr></thead><tbody>
<tr><td>RE1</td><td>20</td><td>15</td><td>25</td><td>20</td><td>10</td><td>20</td><td>110</td><td>18.3</td></tr>
<tr><td>RE2</td><td>10</td><td>10</td><td>5</td><td>15</td><td>10</td><td>10</td><td>60</td><td>10.0</td></tr>
<tr><td>RE3</td><td>15</td><td>20</td><td>10</td><td>15</td><td>25</td><td>15</td><td>100</td><td>16.7</td></tr>
<tr><td>RE4</td><td>5</td><td>0</td><td>5</td><td>5</td><td>5</td><td>10</td><td>30</td><td>5.0</td></tr>
<tr><td>RE5</td><td>10</td><td>10</td><td>15</td><td>5</td><td>10</td><td>10</td><td>60</td><td>10.0</td></tr>
<tr><td>RE6</td><td>25</td><td>30</td><td>25</td><td>30</td><td>20</td><td>25</td><td>155</td><td>25.8</td></tr>
<tr><td>RE7</td><td>5</td><td>5</td><td>5</td><td>5</td><td>10</td><td>0</td><td>30</td><td>5.0</td></tr>
<tr><td>RE8</td><td>10</td><td>10</td><td>10</td><td>5</td><td>10</td><td>10</td><td>55</td><td>9.2</td></tr>
</tbody></table>
<p>Check: each user column sums to 100; values total 110+60+100+30+60+155+30+55 = 600; averages total 100. Ranking: RE6 (25.8), RE1 (18.3), RE3 (16.7), RE2 = RE5 (10.0), RE8 (9.2), RE4 = RE7 (5.0).</p>`
        },
        {
          q: 'Which items need a consensus discussion, and what do you ask?',
          a: `<p>Look for ties and spread, not only the totals.</p>
<ul>
<li><strong>RE2 vs RE5</strong> tie at 10.0. Ask &ldquo;Why would reminders or segmentation come first?&rdquo; Reminders support recurring donations; segmentation needs history data first (a dependency on RE1).</li>
<li><strong>RE3 Detailed Reporting</strong> ranges from $10 to $25. Ask the $25 voter and the $10 voter why. Perhaps reporting is a funder obligation (compliance) or perhaps it can be a later spreadsheet export.</li>
<li><strong>RE4 and RE7</strong> are low on average, but U6 gave RE7 nothing and U1 gave RE4 only 5. Confirm nobody sees a hidden need before dropping them.</li>
</ul>
<p>Agree a final order and write the rationale next to each decision. If the team still disagrees, the named decision maker decides.</p>`
        },
        {
          q: 'How can you combine MoSCoW with the $100 approach?',
          a: `<p>Use MoSCoW for the coarse buckets and $100 for the strength and order inside them.</p>
<ol>
<li>Cut the dollar totals into MoSCoW bands. Here: <strong>Must</strong> = RE6 and RE1 (together 44.2 of 100 average dollars; the nonprofit cannot take or track donations without them). <strong>Should</strong> = RE3. <strong>Could</strong> = RE2, RE5, RE8. <strong>Won't this release</strong> = RE4 and RE7 (5.0 each).</li>
<li>Check consistency: a Must that received very few dollars, or a Won't that received many, signals a disagreement that needs a &ldquo;why&rdquo;.</li>
<li>Spend the release capacity top-down: all Musts, then Shoulds, then Coulds if time remains.</li>
</ol>
<p>Alternative order: first MoSCoW (with rationale), then give each stakeholder $100 to spend only on the Should and Could items to order them. Either way, add a cost check, because $100 ignores cost.</p>`
        }
      ]
    }
  ],
  flashcards: [
    { id: 'l3-f01', front: 'Why do requirements need prioritizing?', back: 'Resources (time, money, people) are limited and every stakeholder believes their requirements matter most. Prioritizing allocates effort to the highest benefit, shows what to cut if the schedule slips, and avoids building unneeded features.', tag: 'definition' },
    { id: 'l3-f02', front: 'Name the sample prioritization criteria from the slide.', back: 'Customer value, business value, risk, cost, implementation difficulty, time to market, regulatory compliance, competitive advantage, contractual commitments. Agree on the criteria before rating anything.', tag: 'definition' },
    { id: 'l3-f03', front: 'Who contributes to prioritization?', back: 'Customers, project sponsors, project management and developers. Customers give value; developers give cost, difficulty and risk; sponsors and management arbitrate when views conflict.', tag: 'definition' },
    { id: 'l3-f04', front: 'Dependencies: implemented in sequence vs together?', back: 'Sequence: B only makes sense after A (cannot pay for an item that is not in the cart). Together: A and B ship in one release (accept credit cards plus handle rejected or stolen cards).', tag: 'compare' },
    { id: 'l3-f05', front: 'What three conflict arenas does negotiation address?', back: 'Among stakeholders (goals, features, requirements); among projects (cost, benefit, risk, time); and between customers and suppliers (around resources).', tag: 'definition' },
    { id: 'l3-f06', front: 'What is triage in RE?', back: 'Quickly sorting requirements into what gets resources now, what can wait and what is dropped, when you cannot do everything. The term comes from emergency medicine.', tag: 'definition' },
    { id: 'l3-f07', front: 'How does In or Out work?', back: 'The group makes a binary decision per requirement against the business objectives, keeping only the bare minimum for release 1. Then it revisits the previously out items for the next release.', tag: 'definition' },
    { id: 'l3-f08', front: 'How many comparisons does pairwise need for 10 items? For 24?', back: 'n(n-1)/2: 45 for 10 items and 276 for 24 items. That growth is why the technique is limited to about a couple of dozen requirements.', tag: 'apply' },
    { id: 'l3-f09', front: 'Why not rank-order every requirement?', back: 'It is overkill: you implement them in release batches, not one by one. Grouping requirements with similar priority, or that must be built together, is sufficient.', tag: 'definition' },
    { id: 'l3-f10', front: 'Three-level scale: why combine importance and urgency?', back: 'Plain High/Medium/Low is vague and drifts to High. Two dimensions give a defensible level: important and urgent is High, important not urgent is Medium, neither is Low, urgent not important is dropped.', tag: 'compare' },
    { id: 'l3-f11', front: 'Urgent but not important: what do you do?', back: 'Do not spend effort. It is usually someone else\'s pressure or politics. Scrub it or set it low priority.', tag: 'apply' },
    { id: 'l3-f12', front: 'MoSCoW: define Must.', back: 'The requirement must be satisfied for the solution to be considered a success. If you can delete it and the product still succeeds, it is not a Must.', tag: 'definition' },
    { id: 'l3-f13', front: 'MoSCoW: define Should and Could.', back: 'Should: important and included if possible, but not mandatory for success. Could: desirable but deferrable or removable; implement only if time and resources permit.', tag: 'compare' },
    { id: 'l3-f14', front: 'MoSCoW: define Won\'t.', back: 'Not implemented at this time but could be included in a future release. It means deferred, not never; always say for which release.', tag: 'definition' },
    { id: 'l3-f15', front: 'What are the weaknesses of MoSCoW?', back: 'No rationale for assignments, ambiguous timing of Won\'t, and a tendency to mark everything Must. No numbers, no cost, and no order inside a bucket.', tag: 'compare' },
    { id: 'l3-f16', front: 'Describe the $100 method.', back: 'Each participant gets 100 imaginary dollars and spends them on requirements; more dollars mean higher priority. When the money is gone nothing else is bought. Add the dollars per requirement across participants.', tag: 'definition' },
    { id: 'l3-f17', front: 'What are the risks of the $100 method?', back: 'Gaming (putting all dollars on one favourite or coordinating votes) and it ignores cost, reflecting only perceived value. Reduce with caps, private allocations and a why discussion.', tag: 'compare' },
    { id: 'l3-f18', front: '$100 with 6 users: what must the grand total be?', back: '6 x 100 = 600 dollars across all requirements. Divide a requirement\'s sum by 6 for its average; all averages must add up to 100.', tag: 'apply' },
    { id: 'l3-f19', front: 'State the Wiegers priority formula.', back: 'Priority = Value% / (Cost% x cost weight + Risk% x risk weight). Value% is the share of total value; high value with low cost and low risk gives the highest priority.', tag: 'definition' },
    { id: 'l3-f20', front: 'How is total value computed in the matrix?', back: 'Total value = relative benefit x benefit weight + relative penalty x penalty weight. Example: benefit 2, penalty 4, weights 2 and 1 gives 4 + 4 = 8.', tag: 'example' },
    { id: 'l3-f21', front: 'Relative benefit vs relative penalty?', back: 'Benefit: value gained if the feature is present. Penalty: harm if it is absent. A checkbox feature has low benefit but high penalty, so low benefit does not equal low penalty.', tag: 'compare' },
    { id: 'l3-f22', front: 'Who rates what in the Wiegers matrix?', back: 'Customer representatives rate benefit and penalty. Developers rate cost and technical risk. Each on a 1-9 scale; then convert to percentages of the column totals.', tag: 'definition' },
    { id: 'l3-f23', front: 'What is QFD?', back: 'Quality Function Deployment: a rigorous way to relate customer value to features, value being the benefit of having it plus the penalty of lacking it. Wiegers\' matrix is its lightweight adaptation.', tag: 'definition' },
    { id: 'l3-f24', front: 'AHP rating scale?', back: '1 equal, 3 moderate, 5 strong, 7 very strong, 9 extremely strong; 2, 4, 6, 8 are halfway values. If A is 3x B then B vs A is 1/3.', tag: 'definition' },
    { id: 'l3-f25', front: 'AHP procedure in three steps?', back: 'Build the pairwise matrix with reciprocals, normalize by dividing each cell by its column sum, then average each row. The row averages are the priority vector and sum to 1.', tag: 'definition' },
    { id: 'l3-f26', front: 'Lecture AHP example: the priorities?', back: 'Criteria Stakeholder Commitment, Financial, Strategic, Risk get EV 0.07, 0.39, 0.46, 0.08. Strategic is highest, Financial second.', tag: 'example' },
    { id: 'l3-f27', front: 'Lab 3 AHP result?', back: 'FR1 0.269, FR2 0.463, FR4 0.101, NFR1 0.168. Highest priority FR2 (critics post reviews); lowest FR4 (notifications).', tag: 'example' },
    { id: 'l3-f28', front: 'Which technique ignores cost, and which includes it?', back: 'MoSCoW, three-level and $100 ignore cost. The value/cost/risk matrix divides value by cost and risk. AHP includes cost only if it is one of the criteria you compare.', tag: 'compare' },
    { id: 'l3-f29', front: 'Name two games people play with priorities.', back: 'Inflating labels (high, super-high, incredibly high) and decibel prioritization where the loudest voice wins. Deflate with probing questions about alternatives and the consequence of deferral.', tag: 'example' }
  ],
  quiz: [
    {
      id: 'l3-q01', kind: 'single', level: 'concept',
      prompt: 'What is the main reason prioritization is unavoidable in a requirements project?',
      options: [
        'Developers dislike writing documentation',
        'Resources are limited and each stakeholder believes theirs are the most important requirements',
        'Requirements always change after release',
        'Standards require a ranked list'
      ],
      answer: 1,
      why: 'The slides frame the problem as limited resources plus competing stakeholder claims. Change and standards matter elsewhere but do not force ranking.'
    },
    {
      id: 'l3-q02', kind: 'tf', level: 'concept',
      prompt: 'Stakeholders should agree on the prioritization criteria before they start rating requirements.',
      answer: true,
      why: 'Without agreed criteria (value, cost, risk, time to market, compliance...) people rank against different meanings of important and the result cannot be defended.'
    },
    {
      id: 'l3-q03', kind: 'single', level: 'concept',
      prompt: 'Accepting credit-card payments while ignoring rejected or stolen cards is an example of requirements that are:',
      options: [
        'Independent and can be split across releases',
        'Implemented in sequence, exceptions first',
        'Implemented together, because the normal flow is incomplete without its exceptions',
        'Rejected by the MoSCoW rule'
      ],
      answer: 2,
      why: 'This is the slide example of requirements implemented together. The cart/pay example, not this one, shows implementation in sequence.'
    },
    {
      id: 'l3-q04', kind: 'multi', level: 'concept',
      prompt: 'Which of these are sample prioritization criteria from the lecture? Select all that apply.',
      options: [
        'Regulatory compliance',
        'Which stakeholder is loudest',
        'Time to market',
        'Competitive advantage'
      ],
      answer: [0, 2, 3],
      why: 'Compliance, time to market and competitive advantage are listed criteria. Loudness is a trap (decibel prioritization), not a legitimate criterion.'
    },
    {
      id: 'l3-q05', kind: 'single', level: 'concept',
      prompt: 'Two projects compete for the same developers, each claiming a better payoff. What kind of conflict is this on the negotiation slide?',
      options: [
        'Customers and suppliers around resources',
        'Stakeholders over goals',
        'Stakeholders over requirements',
        'Conflict among projects on cost, benefit, risk and time'
      ],
      answer: 3,
      why: 'The three arenas are stakeholders, projects (cost, benefit, risk, time) and customers with suppliers (resources). Competing projects fall in the middle one.'
    },
    {
      id: 'l3-q06', kind: 'tf', level: 'concept',
      prompt: 'In MoSCoW, a requirement marked Won\'t will never be implemented.',
      answer: false,
      why: 'Won\'t means not implemented at this time; it could be included in a future release. Reading it as never is the classic mistake.'
    },
    {
      id: 'l3-q07', kind: 'single', level: 'theory',
      prompt: 'On the importance x urgency grid, which combination is rated High?',
      options: [
        'Important but not urgent',
        'Urgent but not important',
        'Important and urgent',
        'Neither important nor urgent'
      ],
      answer: 2,
      why: 'High needs both: needed in the next release or by contract. Important only is Medium; urgent only is political noise to scrub; neither is Low.'
    },
    {
      id: 'l3-q08', kind: 'single', level: 'theory',
      prompt: 'Which pair of weaknesses applies to the $100 method?',
      options: [
        'It requires an expensive tool and cannot group items',
        'It can be gamed, and it ignores cost',
        'It needs n(n-1)/2 comparisons and ignores value',
        'It has only two levels and no totals'
      ],
      answer: 1,
      why: 'People can dump dollars on one item or coordinate, and the method reflects perceived value only. The quadratic comparison count belongs to pairwise and AHP.'
    },
    {
      id: 'l3-q09', kind: 'multi', level: 'theory',
      prompt: 'In the Wiegers value/cost/risk matrix, who supplies which rating? Select all correct statements.',
      options: [
        'Customer representatives rate relative benefit and penalty',
        'Customers rate relative cost',
        'Developers rate relative cost and technical risk',
        'Developers rate relative benefit'
      ],
      answer: [0, 2],
      why: 'Value comes from the customer side, cost and risk from the developer side. Mixing the roles lets each side rate what it does not know.'
    },
    {
      id: 'l3-q10', kind: 'single', level: 'theory',
      prompt: 'In AHP, requirement X is "strongly" more important than Y. What goes in the cell for Y compared with X?',
      options: ['5', '1/5', '1/3', '1/9'],
      answer: 1,
      why: 'Strong is 5, so X vs Y = 5 and Y vs X is the reciprocal 1/5. Using 5 in both cells is the common slip.'
    },
    {
      id: 'l3-q11', kind: 'tf', level: 'theory',
      prompt: 'Pairwise comparison scales comfortably to several hundred requirements.',
      answer: false,
      why: 'It needs n(n-1)/2 judgments (276 for 24 items, almost 20,000 for 200), so the lecture limits it to about a couple of dozen.'
    },
    {
      id: 'l3-q12', kind: 'single', level: 'theory',
      prompt: 'A feature has very high value but also very high cost and risk. In the Wiegers formula what happens to its priority?',
      options: [
        'It stays the highest because value is in the numerator',
        'It drops, because cost and risk are in the denominator',
        'It becomes undefined',
        'It is multiplied by the penalty'
      ],
      answer: 1,
      why: 'Priority = Value% / (Cost% x weight + Risk% x weight). A large denominator pulls the result down, which is why cheap, safe items can outrank expensive valuable ones.'
    },
    {
      id: 'l3-q13', kind: 'single', level: 'theory',
      prompt: 'Which sequence correctly describes the AHP procedure?',
      options: [
        'Average rows, normalize, build the matrix',
        'Build the matrix, divide each cell by its column sum, average each row',
        'Build the matrix, divide each cell by its row sum, add the columns',
        'Rank pairs, count wins, sum the columns'
      ],
      answer: 1,
      why: 'Matrix, normalize by column sums, then row averages give the priority vector. Counting wins is plain pairwise ranking, not AHP.'
    },
    {
      id: 'l3-q14', kind: 'single', level: 'practice',
      prompt: 'Two requirements A and B. A is judged "moderately" more important than B (value 3). Build the 2x2 matrix, normalize by column sums, average rows. What is A\'s priority?',
      options: ['0.50', '0.67', '0.75', '0.90'],
      answer: 2,
      why: 'Matrix [[1,3],[1/3,1]]; column sums 4/3 and 4. Normalized column 1: 0.75, 0.25; column 2: 0.75, 0.25. Row averages 0.75 and 0.25. 0.67 would come from 3/(3+1.5), a miscomputation.'
    },
    {
      id: 'l3-q15', kind: 'single', level: 'practice',
      prompt: 'A new data-protection regulation becomes mandatory next month and the system must comply. On the importance x urgency grid, the requirement is:',
      options: [
        'Low: neither important nor urgent',
        'Medium: important, not urgent',
        'Do not do: urgent but not important',
        'High: important and urgent'
      ],
      answer: 3,
      why: 'Compliance with a deadline is both important (legal need) and urgent (next month). Compliance items are effectively automatic High.'
    },
    {
      id: 'l3-q16', kind: 'single', level: 'practice',
      prompt: 'The marketing director demands a splash-screen animation by Friday for a demo. It supports no stated business objective. Where does it fall?',
      options: [
        'Urgent but not important: scrub it or set it low',
        'Important and urgent: High',
        'Important, not urgent: Medium',
        'Must in MoSCoW'
      ],
      answer: 0,
      why: 'The deadline creates urgency but nothing ties it to business objectives, so it is not important. This is the political quadrant Wiegers says not to spend effort on.'
    },
    {
      id: 'l3-q17', kind: 'single', level: 'practice',
      prompt: 'Online shop, release 1. Users must pay for the cart, would like a saved wish list, may like gift wrapping, and AR book preview is postponed. Which MoSCoW assignment is correct (in that order)?',
      options: [
        'Should, Must, Could, Won\'t',
        'Must, Could, Should, Won\'t',
        'Must, Should, Could, Won\'t this release',
        'Must, Should, Won\'t, Could'
      ],
      answer: 2,
      why: 'Payment is essential (Must), wish list important but optional (Should), gift wrapping merely desirable (Could), AR deferred (Won\'t this release).'
    },
    {
      id: 'l3-q18', kind: 'single', level: 'practice',
      prompt: 'A feature has Value% = 12, Cost% = 8, Risk% = 10. Weights: cost 1, risk 0.5. What is its priority?',
      options: ['0.67', '0.92', '1.50', '2.40'],
      answer: 1,
      why: 'Priority = 12 / (8 x 1 + 10 x 0.5) = 12 / 13 = 0.92. 0.67 forgets the 0.5 risk weight; 1.50 ignores risk entirely.'
    },
    {
      id: 'l3-q19', kind: 'single', level: 'practice',
      prompt: 'Benefit 6, penalty 3, benefit weight 2, penalty weight 1. What is the total value?',
      options: ['9', '12', '15', '21'],
      answer: 2,
      why: 'Total value = 6 x 2 + 3 x 1 = 15. 9 adds without weights; 12 forgets the penalty.'
    },
    {
      id: 'l3-q20', kind: 'single', level: 'practice',
      prompt: 'Six users gave RE3 these dollars: 15, 20, 10, 15, 25, 15. What is the average, and what does the spread suggest?',
      options: [
        '16.7; the $10 to $25 spread needs a why discussion',
        '16.7; no discussion needed because the average is clear',
        '100; the sum is the average',
        '25; take the maximum'
      ],
      answer: 0,
      why: 'Sum 100, divided by 6 is 16.7. The range 10 to 25 shows real disagreement, so ask the extremes why before accepting the average.'
    },
    {
      id: 'l3-q21', kind: 'multi', level: 'practice',
      prompt: 'Lab 3 AHP gave FR1 0.269, FR2 0.463, FR4 0.101, NFR1 0.168. Select all true statements.',
      options: [
        'FR2 has the highest priority',
        'FR4 has the lowest priority',
        'NFR1 outranks FR4',
        'FR1 has the highest priority'
      ],
      answer: [0, 1, 2],
      why: 'Order is FR2 > FR1 > NFR1 > FR4. FR1 is second, not first. The four values add to about 1.'
    },
    {
      id: 'l3-q22', kind: 'tf', level: 'practice',
      prompt: 'In an AHP priority vector produced correctly by normalizing columns and averaging rows, the priorities add up to 1.',
      answer: true,
      why: 'Each normalized column sums to 1, so the sum of all cells is n and the average of row sums is 1. A different total means an arithmetic slip.'
    },
    {
      id: 'l3-q23', kind: 'single', level: 'practice',
      prompt: 'In the lecture AHP example (EV: SC 0.07, Financial 0.39, Strategic 0.46, Risk 0.08), which criterion should drive the decision most?',
      options: ['Financial', 'Risk', 'Stakeholder Commitment', 'Strategic'],
      answer: 3,
      why: 'Strategic has the largest weight, 0.46. Financial (0.39) is second, which is the tempting wrong pick.'
    },
    {
      id: 'l3-q24', kind: 'single', level: 'practice',
      prompt: 'Your top-ranked "Redo" feature depends on "Undo", ranked low by the matrix. What do you do?',
      options: [
        'Ship Redo alone; dependencies do not matter',
        'Delete Undo from the project',
        'Raise or schedule Undo with Redo, because dependencies override the raw score',
        'Re-run the matrix until Undo is higher'
      ],
      answer: 2,
      why: 'A high-priority item cannot work without its prerequisite, so the prerequisite is built first or together. Re-running the numbers to change the outcome is gaming.'
    },
    {
      id: 'l3-q25', kind: 'tf', level: 'theory',
      prompt: 'In the Wiegers matrix a feature with low benefit must also have low penalty.',
      answer: false,
      why: 'Checkbox features show low benefit but high penalty because their absence hurts (a competitor has it, or buyers expect it).'
    }
  ],
  glossary: [
    { term: 'Prioritization', def: 'Deciding the relative order or grouping in which requirements are implemented, using agreed criteria, because resources are limited.', related: ['Triage', 'Criteria'] },
    { term: 'Negotiation', def: 'The stakeholder discussion that resolves conflicts over goals, features, requirements, project resources, or supplier relations, ending in a documented compromise.', related: ['Prioritization'] },
    { term: 'Triage', def: 'Sorting requirements fast into what is done now, what waits, and what is dropped, when not everything can be done. Borrowed from emergency medicine.', related: ['In or Out'] },
    { term: 'Prioritization criteria', def: 'The agreed bases for ranking: customer and business value, risk, cost, difficulty, time to market, regulatory compliance, competitive advantage and contractual commitments.', related: ['Prioritization'] },
    { term: 'Dependency (sequence)', def: 'A relationship where one requirement can only be used after another exists, such as paying only for products already in the cart.', related: ['Dependency (together)'] },
    { term: 'Dependency (together)', def: 'A relationship where requirements must ship in the same release because one is incomplete without the other, such as card payment plus rejected-card handling.', related: ['Dependency (sequence)'] },
    { term: 'In or Out', def: 'A binary prioritization: decide for each requirement whether it is in the release, keeping only the bare minimum for release 1, then revisit the out items later.', related: ['Triage'] },
    { term: 'Pairwise comparison', def: 'Comparing every pair of requirements and choosing the higher priority of each; counting wins yields a rank order. Needs n(n-1)/2 comparisons.', related: ['Rank order', 'AHP'] },
    { term: 'Rank order', def: 'A full ordering of requirements from first to last. Usually overkill because requirements are implemented in release batches.', related: ['Pairwise comparison'] },
    { term: 'Three-level scale', def: 'Classifying requirements as High, Medium or Low, improved by combining importance and urgency so each level has a clear meaning.', related: ['Urgency grid'] },
    { term: 'Urgency grid', def: 'A 2x2 of importance and urgency: important and urgent is High, important not urgent Medium, neither Low, urgent but not important is not worth effort.', related: ['Three-level scale'] },
    { term: 'MoSCoW', def: 'Four-bucket scheme: Must (solution fails without it), Should (important, not mandatory), Could (desirable, if resources permit), Won\'t (not at this time, maybe later).', related: ['Won\'t'] },
    { term: 'Won\'t', def: 'The MoSCoW bucket for requirements not implemented at this time but possibly in a future release. Means deferred, not never.', related: ['MoSCoW'] },
    { term: '$100 method', def: 'Each participant spends a fixed 100 imaginary dollars across requirements; the totals or averages give priorities. Can be gamed and ignores cost.', related: ['Cumulative voting'] },
    { term: 'Gaming', def: 'Distorting a prioritization method to favour a pet item, for example putting all $100 on one requirement or inflating every label to High.', related: ['$100 method'] },
    { term: 'Relative benefit', def: 'Customer rating (1-9) of the value a feature adds when present; one input to total value in the Wiegers matrix.', related: ['Relative penalty'] },
    { term: 'Relative penalty', def: 'Customer rating (1-9) of the damage caused by leaving a feature out; high for checkbox features that are expected but rarely used.', related: ['Relative benefit'] },
    { term: 'Wiegers prioritization matrix', def: 'A spreadsheet method computing priority = Value% / (Cost% x cost weight + Risk% x risk weight) from relative benefit, penalty, cost and risk ratings.', related: ['QFD'] },
    { term: 'QFD', def: 'Quality Function Deployment: a rigorous technique linking customer value (benefit of presence plus penalty of absence) to features; the Wiegers matrix is its lightweight form.', related: ['Wiegers prioritization matrix'] },
    { term: 'AHP', def: 'Analytic Hierarchy Process: derive priorities from a pairwise comparison matrix on a 1-9 scale by normalizing columns and averaging rows.', related: ['Pairwise comparison', 'Priority vector'] },
    { term: 'Priority vector', def: 'The AHP result: the row averages of the normalized matrix (called EV on the slides). They are weights that sum to 1.', related: ['AHP'] },
    { term: 'Reciprocal', def: 'In AHP, if A vs B is x then B vs A is 1/x; the lower triangle of the matrix is filled this way and the diagonal is 1.', related: ['AHP'] },
    { term: 'Consistency ratio', def: 'An extension to AHP (not on the slides): CR = CI/RI measures whether judgments contradict each other; below about 0.10 is acceptable.', related: ['AHP'] },
    { term: 'Decibel prioritization', def: 'A trap where the loudest or most insistent stakeholder\'s requirements win instead of those justified by agreed criteria.', related: ['Negotiation'] }
  ]
});
