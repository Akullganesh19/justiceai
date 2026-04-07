export const DOCUMENT_TEMPLATES = [
  {
    id: 'legal-notice',
    title: 'STATUTORY_DEMAND_NOTICE',
    description:
      'A formal notice sent before filing a civil suit. Required under Section 80 CPC for government bodies.',
    icon: 'FileWarning',
    color: 'purple',
    fields: [
      { id: 'senderName', label: 'Your Full Name', type: 'text', required: true },
      { id: 'senderAddress', label: 'Your Address', type: 'textarea', required: true },
      { id: 'recipientName', label: 'Recipient Name / Organization', type: 'text', required: true },
      { id: 'recipientAddress', label: 'Recipient Address', type: 'textarea', required: true },
      {
        id: 'subject',
        label: 'Subject of Notice',
        type: 'text',
        required: true,
        placeholder: 'e.g., Demand for refund of defective product',
      },
      {
        id: 'facts',
        label: 'Statement of Facts',
        type: 'textarea',
        required: true,
        placeholder: 'Describe the situation in detail with dates...',
      },
      {
        id: 'demand',
        label: 'Your Demand / Relief Sought',
        type: 'textarea',
        required: true,
        placeholder: 'e.g., Full refund of ₹85,000 within 15 days...',
      },
      {
        id: 'deadline',
        label: 'Response Deadline (days)',
        type: 'number',
        required: true,
        placeholder: '15',
      },
    ],
    generate: (data) => {
      const today = new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
      return `LEGAL NOTICE
═══════════════════════════════════════════════

Date: ${today}
Ref. No.: LN/${new Date().getFullYear()}/${Math.floor(Math.random() * 9000) + 1000}

TO,
${data.recipientName}
${data.recipientAddress}

FROM,
${data.senderName}
${data.senderAddress}

SUBJECT: ${data.subject}

═══════════════════════════════════════════════

Dear Sir/Madam,

Under instructions from and on behalf of my client, ${data.senderName}, I hereby serve upon you this Legal Notice as follows:

STATEMENT OF FACTS:
${data.facts}

DEMAND:
${data.demand}

NOTICE:
You are hereby called upon to comply with the above demand within ${data.deadline || 15} days from the receipt of this notice, failing which my client shall be constrained to initiate appropriate legal proceedings against you before the competent court of law, at your risk, cost, and consequences, which please note.

You are further advised to treat this matter with utmost urgency.

${data.senderName}
(Sender)

═══════════════════════════════════════════════
DISCLAIMER: This document was generated using JusticeAI
for informational purposes only. Please consult a
qualified advocate before sending any legal communication.
═══════════════════════════════════════════════`;
    },
  },
  {
    id: 'consumer-complaint',
    title: 'CONSUMER_PETITION',
    description:
      'File a complaint with the Consumer Disputes Redressal Commission under the Consumer Protection Act, 2019.',
    icon: 'ShoppingBag',
    color: 'accent-success',
    fields: [
      { id: 'complainantName', label: 'Complainant (Your) Name', type: 'text', required: true },
      { id: 'complainantAddress', label: 'Complainant Address', type: 'textarea', required: true },
      {
        id: 'oppositeParty',
        label: 'Opposite Party (Seller/Company)',
        type: 'text',
        required: true,
      },
      {
        id: 'oppositePartyAddress',
        label: 'Opposite Party Address',
        type: 'textarea',
        required: true,
      },
      {
        id: 'productService',
        label: 'Product / Service',
        type: 'text',
        required: true,
        placeholder: 'e.g., Samsung Galaxy S24 Ultra',
      },
      { id: 'purchaseDate', label: 'Date of Purchase', type: 'date', required: true },
      { id: 'amount', label: 'Amount Paid (₹)', type: 'number', required: true },
      {
        id: 'deficiency',
        label: 'Nature of Deficiency / Defect',
        type: 'textarea',
        required: true,
      },
      {
        id: 'relief',
        label: 'Relief Sought',
        type: 'textarea',
        required: true,
        placeholder: 'e.g., Full refund + compensation for mental agony...',
      },
    ],
    generate: (data) => {
      const today = new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
      const forumLevel =
        (data.amount || 0) <= 5000000
          ? 'District'
          : (data.amount || 0) <= 20000000
            ? 'State'
            : 'National';
      return `BEFORE THE ${forumLevel.toUpperCase()} CONSUMER DISPUTES
REDRESSAL COMMISSION
═══════════════════════════════════════════════

Consumer Complaint No. _______ of ${new Date().getFullYear()}
Date: ${today}

IN THE MATTER OF:

${data.complainantName}
${data.complainantAddress}
                                    ... COMPLAINANT

            VERSUS

${data.oppositeParty}
${data.oppositePartyAddress}
                                    ... OPPOSITE PARTY

═══════════════════════════════════════════════

COMPLAINT UNDER SECTION 35 OF THE
CONSUMER PROTECTION ACT, 2019

RESPECTFULLY SHOWETH:

1. That the complainant is a consumer as defined under
   Section 2(7) of the Consumer Protection Act, 2019.

2. That the complainant purchased ${data.productService}
   from the Opposite Party on ${data.purchaseDate} for a
   consideration of ₹${Number(data.amount).toLocaleString('en-IN')}.

3. NATURE OF DEFICIENCY/DEFECT:
   ${data.deficiency}

4. That the complainant has suffered loss and injury due
   to the negligence and deficiency in service by the
   Opposite Party.

PRAYER:
In view of the above facts, the complainant prays that
this Hon'ble Commission may be pleased to:

${data.relief}

The complainant also prays for costs of this complaint
and any other relief deemed fit by this Hon'ble Commission.

VERIFICATION:
I, ${data.complainantName}, do hereby verify that the
contents of this complaint are true and correct to the
best of my knowledge and belief.

Place: ___________
Date: ${today}

(${data.complainantName})
Complainant

═══════════════════════════════════════════════
Forum Level: ${forumLevel} Commission
(Based on claim amount of ₹${Number(data.amount).toLocaleString('en-IN')})
═══════════════════════════════════════════════
DISCLAIMER: Generated by JusticeAI for informational
purposes. Please have a qualified advocate review before
filing.
═══════════════════════════════════════════════`;
    },
  },
  {
    id: 'rti-application',
    title: 'RTI_STATUTORY_REQUEST',
    description:
      "Right to Information request under the RTI Act, 2005. Every citizen's right to access government information.",
    icon: 'FileSearch',
    color: 'accent-info',
    fields: [
      { id: 'applicantName', label: 'Applicant Name', type: 'text', required: true },
      { id: 'applicantAddress', label: 'Applicant Address', type: 'textarea', required: true },
      {
        id: 'pioName',
        label: 'Public Information Officer (if known)',
        type: 'text',
        required: false,
        placeholder: 'Name of PIO or Department',
      },
      {
        id: 'authority',
        label: 'Public Authority / Department',
        type: 'text',
        required: true,
        placeholder: 'e.g., Municipal Corporation, Delhi',
      },
      { id: 'authorityAddress', label: 'Authority Address', type: 'textarea', required: true },
      {
        id: 'information',
        label: 'Information Sought',
        type: 'textarea',
        required: true,
        placeholder: 'List each question/information point clearly (numbered)...',
      },
      {
        id: 'period',
        label: 'Period/Year of Information',
        type: 'text',
        required: false,
        placeholder: 'e.g., January 2023 to December 2024',
      },
      {
        id: 'bpl',
        label: 'Are you Below Poverty Line?',
        type: 'select',
        options: ['No', 'Yes'],
        required: true,
      },
    ],
    generate: (data) => {
      const today = new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
      return `APPLICATION UNDER THE RIGHT TO INFORMATION ACT, 2005
═══════════════════════════════════════════════

Date: ${today}

To,
The Public Information Officer${data.pioName ? ` (${data.pioName})` : ''}
${data.authority}
${data.authorityAddress}

Subject: Application under Section 6(1) of the RTI Act, 2005

Sir/Madam,

I, ${data.applicantName}, an Indian citizen, hereby
submit this application under Section 6(1) of the
Right to Information Act, 2005 to seek the following
information:

═══════════════════════════════════════════════
INFORMATION SOUGHT:
═══════════════════════════════════════════════

${data.information}

${data.period ? `Period of Information: ${data.period}\n` : ''}
═══════════════════════════════════════════════

I request that the above information be provided to
me in the form of photocopies / electronic format
(CD/email) as applicable.

${
  data.bpl === 'Yes'
    ? 'I belong to Below Poverty Line (BPL) category and am therefore exempt from payment of fee as per Section 7(5) of the RTI Act, 2005. BPL certificate is enclosed.'
    : 'I am enclosing an IPO / DD / Court Fee Stamp of ₹10 (Ten Rupees Only) as prescribed fee under Section 6 of the RTI Act, 2005.'
}

I request you to kindly provide the information within
30 days as mandated under Section 7(1) of the Act.

Thanking you,

${data.applicantName}
${data.applicantAddress}

Encl:
1. ${data.bpl === 'Yes' ? 'BPL Certificate' : 'IPO/DD/Court Fee Stamp of ₹10'}
2. Self-addressed envelope

═══════════════════════════════════════════════
IMPORTANT: Under Section 7(1), information must be
provided within 30 days. If denied, you may file a
First Appeal under Section 19(1) within 30 days.
═══════════════════════════════════════════════
DISCLAIMER: Generated by JusticeAI for informational
purposes only.
═══════════════════════════════════════════════`;
    },
  },
  {
    id: 'fir-draft',
    title: 'BNSS_INCIDENT_REPORT',
    description:
      'Prepare a structured First Information Report draft to present at the police station.',
    icon: 'Shield',
    color: 'accent-error',
    fields: [
      { id: 'informantName', label: 'Informant (Your) Name', type: 'text', required: true },
      { id: 'informantAddress', label: 'Your Address', type: 'textarea', required: true },
      { id: 'informantPhone', label: 'Phone Number', type: 'text', required: true },
      {
        id: 'policeStation',
        label: 'Police Station',
        type: 'text',
        required: true,
        placeholder: 'e.g., Koramangala PS, Bengaluru',
      },
      { id: 'incidentDate', label: 'Date of Incident', type: 'date', required: true },
      {
        id: 'incidentTime',
        label: 'Approximate Time',
        type: 'text',
        required: true,
        placeholder: 'e.g., Between 8 PM and 9 PM',
      },
      { id: 'incidentPlace', label: 'Place of Occurrence', type: 'textarea', required: true },
      {
        id: 'accusedDetails',
        label: 'Details of Accused (if known)',
        type: 'textarea',
        required: false,
        placeholder: 'Name, description, address if known...',
      },
      {
        id: 'narrative',
        label: 'Detailed Narrative of Incident',
        type: 'textarea',
        required: true,
        placeholder: 'Describe exactly what happened in chronological order...',
      },
      {
        id: 'stolenLost',
        label: 'Property Stolen / Damaged (if any)',
        type: 'textarea',
        required: false,
      },
    ],
    generate: (data) => {
      const today = new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
      return `FIRST INFORMATION REPORT — DRAFT
═══════════════════════════════════════════════
(Under Section 173 of the Bharatiya Nagarik Suraksha Sanhita / 
Section 154 of the Code of Criminal Procedure)

Date of Report: ${today}

To,
The Station House Officer
${data.policeStation}

Subject: Request to Register FIR

═══════════════════════════════════════════════

INFORMANT DETAILS:
Name:    ${data.informantName}
Address: ${data.informantAddress}
Phone:   ${data.informantPhone}

═══════════════════════════════════════════════

INCIDENT DETAILS:
Date of Incident: ${data.incidentDate}
Time:             ${data.incidentTime}
Place:            ${data.incidentPlace}

${data.accusedDetails ? `ACCUSED DETAILS:\n${data.accusedDetails}\n` : 'ACCUSED: Unknown\n'}
═══════════════════════════════════════════════

STATEMENT / NARRATIVE:

${data.narrative}

${data.stolenLost ? `\nPROPERTY STOLEN / DAMAGED:\n${data.stolenLost}\n` : ''}
═══════════════════════════════════════════════

I, ${data.informantName}, hereby state that the above
facts are true and correct to the best of my knowledge
and belief. I request that this report be registered
and appropriate action be taken.

Signature: _______________
(${data.informantName})
Date: ${today}

═══════════════════════════════════════════════
YOUR RIGHTS:
• Police MUST register your FIR (Lalita Kumari v.
  Govt. of UP, 2013 — Supreme Court)
• Request a FREE copy of the FIR (Section 154(2) CrPC)
• If refused, approach the SP or file online via your
  State's e-FIR portal
═══════════════════════════════════════════════
DISCLAIMER: This is a DRAFT to help you organize your
complaint. The actual FIR will be recorded by the
police officer. Generated by JusticeAI.
═══════════════════════════════════════════════`;
    },
  },
];
