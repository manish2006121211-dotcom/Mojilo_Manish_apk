import { Test, Question, PDFMetadata } from '../types';

export const INITIAL_TESTS: Test[] = [
  {
    id: 'test-tet1-01',
    title: 'TET-1 મોક ટેસ્ટ - ૧ (બાળ વિકાસ અને પ્રાથમિક શિક્ષણશાસ્ત્ર)',
    description: 'બાળ વિકાસ, શૈક્ષણિક મનોવિજ્ઞાન અને શિક્ષણ સિદ્ધાંતો આધારિત ૧૫ મહત્વપૂર્ણ પ્રશ્નોની ટેસ્ટ.',
    timerMinutes: 15,
    totalMarks: 15,
    isPublished: true,
    questionCount: 15,
    createdAt: new Date().toISOString()
  },
  {
    id: 'test-tet1-02',
    title: 'TET-1 મોક ટેસ્ટ - ૨ (ગુજરાતી ભાષા અને વ્યાકરણ)',
    description: 'ગુજરાતી સાહિત્ય, સમાસ, સંધિ, છંદ, અલંકાર અને શબ્દભંડોળ આધારિત મોક ટેસ્ટ.',
    timerMinutes: 10,
    totalMarks: 10,
    isPublished: true,
    questionCount: 10,
    createdAt: new Date().toISOString()
  },
  {
    id: 'test-tet1-03',
    title: 'TET-1 મોક ટેસ્ટ - ૩ (ગણિત અને પર્યાવરણ)',
    description: 'ધોરણ ૧ થી ૫ ના અભ્યાસક્રમ મુજબ ગણિત અને પર્યાવરણ લક્ષી પ્રશ્નો.',
    timerMinutes: 12,
    totalMarks: 10,
    isPublished: true,
    questionCount: 10,
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_QUESTIONS: Question[] = [
  // Test 1 Questions
  {
    id: 'q-101',
    testId: 'test-tet1-01',
    questionText: 'બાળકના મનોવૈજ્ઞાનિક વિકાસમાં "પ્રયત્ન અને ભૂલ દ્વારા શિક્ષણ" નો સિદ્ધાંત કોણે આપ્યો હતો?',
    optionA: 'સ્કિનર (Skinner)',
    optionB: 'થોર્નડાઇક (Thorndike)',
    optionC: 'પાવલોવ (Pavlov)',
    optionD: 'કોહલર (Kohler)',
    correctOption: 'B',
    explanation: 'ઈ. એલ. થોર્નડાઈકે બિલાડી પર પ્રયોગ કરી "પ્રયત્ન અને ભૂલ" (Trial and Error) નો સિદ્ધાંત આપ્યો હતો.'
  },
  {
    id: 'q-102',
    testId: 'test-tet1-01',
    questionText: 'બાળક સૌપ્રથમ કયા વાતાવરણમાંથી સામાજિકીકરણ શીખે છે?',
    optionA: 'શાળા',
    optionB: 'મિત્રવર્તુળ',
    optionC: 'કુટુંબ / પરિબળ',
    optionD: 'સમૂહ માધ્યમો',
    correctOption: 'C',
    explanation: 'કુટુંબ એ બાળકનું પ્રથમ સામાજિકીકરણ ગૃહ છે જ્યાંથી તે સંસ્કાર અને વર્તન શીખે છે.'
  },
  {
    id: 'q-103',
    testId: 'test-tet1-01',
    questionText: 'બુદ્ધિઆંક (I.Q.) શોધવાનું સૂત્ર નીચેનામાંથી કયું સાચું છે?',
    optionA: 'I.Q. = (માનસિક વય / શારીરિક વય) × 100',
    optionB: 'I.Q. = (શારીરિક વય / માનસિક વય) × 100',
    optionC: 'I.Q. = (માનસિક વય × શારીરિક વય) / 100',
    optionD: 'I.Q. = માનસિક વય + શારીરિક વય',
    correctOption: 'A',
    explanation: 'ટર્મન દ્વારા આપવામાં આવેલું બુદ્ધિઆંક સૂત્ર: (Mental Age / Chronological Age) × 100 છે.'
  },
  {
    id: 'q-104',
    testId: 'test-tet1-01',
    questionText: 'રાષ્ટ્રીય શિક્ષણ નીતિ ૨૦૨૦ (NEP 2020) અનુસાર નવું શૈક્ષણિક માળખું કયું છે?',
    optionA: '10 + 2 + 3',
    optionB: '5 + 3 + 3 + 4',
    optionC: '5 + 4 + 3 + 2',
    optionD: '8 + 4 + 3',
    correctOption: 'B',
    explanation: 'NEP 2020 મુજબ શૈક્ષણિક માળખું 5+3+3+4 માં વિભાજિત કરવામાં આવ્યું છે.'
  },
  {
    id: 'q-105',
    testId: 'test-tet1-01',
    questionText: 'સતત અને વ્યાપક મૂલ્યાંકન (CCE) માં "સતત" શબ્દનો અર્થ શું થાય છે?',
    optionA: 'વર્ષમાં એક જ વાર મૂલ્યાંકન',
    optionB: 'શૈક્ષણિક વર્ષ દરમિયાન સતત ચાલતી પ્રક્રિયા',
    optionC: 'માત્ર રમતગમતનું મૂલ્યાંકન',
    optionD: 'માત્ર ગૃહકાર્યની ચકાસણી',
    correctOption: 'B',
    explanation: 'CCE માં સતત નો અર્થ અધ્યયન-અધ્યાપન પ્રક્રિયા દરમિયાન સતત થતું મૂલ્યાંકન છે.'
  },
  {
    id: 'q-106',
    testId: 'test-tet1-01',
    questionText: 'જીન પિયાજેના મતે સંવેદનાત્મક-પ્રેરક તબક્કો (Sensory-motor stage) કયા વયજૂથનો હોય છે?',
    optionA: '૦ થી ૨ વર્ષ',
    optionB: '૨ થી ૭ વર્ષ',
    optionC: '૭ થી ૧૧ વર્ષ',
    optionD: '૧૧ વર્ષથી વધુ',
    correctOption: 'A',
    explanation: 'જીન પિયાજે ના જ્ઞાનાત્મક વિકાસ મુજબ સંવેદનાત્મક તબક્કો જન્મથી ૨ વર્ષ સુધીનો છે.'
  },
  {
    id: 'q-107',
    testId: 'test-tet1-01',
    questionText: 'મુક્ત અને ફરજિયાત શિક્ષણનો અધિકાર નિયમ (RTE Act 2009) કઈ સાલમાં અમલમાં આવ્યો?',
    optionA: '1 એપ્રિલ 2009',
    optionB: '1 એપ્રિલ 2010',
    optionC: '15 ઓગસ્ટ 2011',
    optionD: '26 જાન્યુઆરી 2009',
    correctOption: 'B',
    explanation: 'ભારતમાં RTE 2009 કાયદો 1 એપ્રિલ 2010 થી દેશભરમાં લાગુ થયો હતો.'
  },
  {
    id: 'q-108',
    testId: 'test-tet1-01',
    questionText: 'બાળકના સર્વાંગી વિકાસ માટે શિક્ષકે કઈ પદ્ધતિ અપનાવવી જોઈએ?',
    optionA: 'માત્ર ગોખણપટ્ટી પદ્ધતિ',
    optionB: 'બાળકેન્દ્રી અને પ્રવૃત્તિમય પદ્ધતિ',
    optionC: 'માત્ર શિક્ષકકેન્દ્રી વ્યાખ્યાન પદ્ધતિ',
    optionD: 'માત્ર શિક્ષા-દંડ આધારિત પદ્ધતિ',
    correctOption: 'B',
    explanation: 'પ્રવૃત્તિ દ્વારા શિક્ષણ અને બાળકેન્દ્રી અભિગમ બાળકના સર્વાંગી વિકાસ માટે શ્રેષ્ઠ છે.'
  },
  {
    id: 'q-109',
    testId: 'test-tet1-01',
    questionText: 'ડિસ્લેક્સિયા (Dyslexia) એ કઈ ક્ષતિ સાથે સંબંધિત છે?',
    optionA: 'વાંચનની ક્ષતિ',
    optionB: 'ગણતરીની ક્ષતિ',
    optionC: 'લેખનની ક્ષતિ',
    optionD: 'સાંભળવાની ક્ષતિ',
    correctOption: 'A',
    explanation: 'ડિસ્લેક્સિયા વાંચન ક્ષમતા સાથે જોડાયેલી શીખવાની અક્ષમતા છે.'
  },
  {
    id: 'q-110',
    testId: 'test-tet1-01',
    questionText: 'વર્ગખંડમાં વિદ્યાર્થીઓને પ્રશ્ન પૂછવા માટે શિક્ષકે શું કરવું જોઈએ?',
    optionA: 'પ્રોત્સાહિત કરવા જોઈએ',
    optionB: 'મનાઈ કરવી જોઈએ',
    optionC: 'દંડ કરવો જોઈએ',
    optionD: 'દુર્લક્ષ કરવું જોઈએ',
    correctOption: 'A',
    explanation: 'પ્રશ્ન પૂછવાથી બાળકની જિજ્ઞાસા વૃત્તિ અને આત્મવિશ્વાસ વધે છે.'
  },

  // Test 2 Questions
  {
    id: 'q-201',
    testId: 'test-tet1-02',
    questionText: '‘વિદ્યાલય’ શબ્દની સાચી સંધિ છૂટી પાડો.',
    optionA: 'વિદ્યા + લય',
    optionB: 'વિદ્યા + આલય',
    optionC: 'વિદ્ય + આલય',
    optionD: 'વિ + આલય',
    correctOption: 'B',
    explanation: 'વિદ્યા (જ્ઞાન) + આલય (સ્થાન) = વિદ્યાલય (સવર્ણ દીર્ઘ સંધિ).'
  },
  {
    id: 'q-202',
    testId: 'test-tet1-02',
    questionText: '‘દંપતી’ શબ્દમાં કયો સમાસ રહેલો છે?',
    optionA: 'તત્પુરુષ સમાસ',
    optionB: 'દ્વંદ્વ સમાસ',
    optionC: 'કર્મધારય સમાસ',
    optionD: 'બહુવ્રીહિ સમાસ',
    correctOption: 'B',
    explanation: 'દંપતી = પતિ અને પત્ની (દ્વંદ્વ સમાસ).'
  },
  {
    id: 'q-203',
    testId: 'test-tet1-02',
    questionText: '‘જેના હાથમાં ચક્ર છે તે’ શબ્દસમૂહ માટે એક શબ્દ આપો.',
    optionA: 'ચક્રધર / ચક્રપાણિ',
    optionB: 'ચક્રવર્તી',
    optionC: 'ચક્રવ્યૂહ',
    optionD: 'ચક્રેશવર',
    correctOption: 'A',
    explanation: 'ચક્રપાણિ અથવા ચક્રધર નો અર્થ જેના હાથમાં ચક્ર છે તેવો થાય છે.'
  },
  {
    id: 'q-204',
    testId: 'test-tet1-02',
    questionText: '‘ગંગાનું પાણી પવિત્ર છે.’ - આ વાક્યમાં ‘ગંગાનું’ એ કઈ વિભક્તિ દર્શાવે છે?',
    optionA: 'પ્રથમા વિભક્તિ',
    optionB: 'તૃતીયા વિભક્તિ',
    optionC: 'ષષ્ઠી વિભક્તિ (સંબંધક)',
    optionD: 'સપ્તમી વિભક્તિ',
    correctOption: 'C',
    explanation: '‘નો, ની, નું, ના’ પ્રત્યય ષષ્ઠી (સંબંધ) વિભક્તિ દર્શાવે છે.'
  },
  {
    id: 'q-205',
    testId: 'test-tet1-02',
    questionText: 'ગુજરાતી સાહિત્યમાં ‘જ્ઞાનપીઠ પુરસ્કાર’ મેળવનાર પ્રથમ સાહિત્યકાર કોણ હતા?',
    optionA: 'પન્નાલાલ પટેલ',
    optionB: 'ઉમાશંકર જોશી',
    optionC: 'રાજેન્દ્ર શાહ',
    optionD: 'રઘુવીર ચૌધરી',
    correctOption: 'B',
    explanation: 'ઉમાશંકર જોશીને ઈ.સ. ૧૯૬૭ માં ‘નિશીથ’ કાવ્યસંગ્રહ માટે પ્રથમ જ્ઞાનપીઠ એવોર્ડ મળ્યો હતો.'
  },

  // Test 3 Questions
  {
    id: 'q-301',
    testId: 'test-tet1-03',
    questionText: 'સૌથી નાની અવિભાજ્ય સંખ્યા (Prime Number) કઈ છે?',
    optionA: '0',
    optionB: '1',
    optionC: '2',
    optionD: '3',
    correctOption: 'C',
    explanation: '2 એ સૌથી નાની અને એકમાત્ર બેકી (Even) અવિભાજ્ય સંખ્યા છે.'
  },
  {
    id: 'q-302',
    testId: 'test-tet1-03',
    questionText: 'ગુજરાત રાજ્યનું પ્રાણી કયું છે?',
    optionA: 'વાઘ',
    optionB: 'સિંહ (Asian Lion)',
    optionC: 'ચિત્તો',
    optionD: 'હાથી',
    correctOption: 'B',
    explanation: 'ગુજરાતનું રાજ્ય પ્રાણી એશિયાટીક સિંહ (ગિરના સિંહ) છે.'
  },
  {
    id: 'q-303',
    testId: 'test-tet1-03',
    questionText: 'વિશ્વ પર્યાવરણ દિવસ કઈ તારીખે ઉજવવામાં આવે છે?',
    optionA: '21 માર્ચ',
    optionB: '5 જૂન',
    optionC: '22 એપ્રિલ',
    optionD: '16 સપ્ટેમ્બર',
    correctOption: 'B',
    explanation: 'દર વર્ષે 5 જૂનના રોજ વિશ્વ પર્યાવરણ દિવસ (World Environment Day) ઉજવાય છે.'
  }
];

export const INITIAL_PDFS: PDFMetadata[] = [
  {
    id: 'pdf-01',
    title: 'TET-1 બાળ વિકાસ અને મનોવિજ્ઞાન સંપૂર્ણ ગાઈડલાઈન PDF',
    category: 'બાળ વિકાસ અને મનોવિજ્ઞાન',
    fileKey: 'tet1_child_psychology_notes.pdf',
    fileUrl: '/api/pdfs/sample/child_psychology.pdf',
    fileSize: '2.4 MB',
    uploadDate: '2026-08-01'
  },
  {
    id: 'pdf-02',
    title: 'ગુજરાતી વ્યાકરણ શોર્ટકટ ટ્રીક્સ અને નિયમો',
    category: 'ગુજરાતી ભાષા અને વ્યાકરણ',
    fileKey: 'gujarati_grammar_rules.pdf',
    fileUrl: '/api/pdfs/sample/gujarati_grammar.pdf',
    fileSize: '1.8 MB',
    uploadDate: '2026-08-03'
  },
  {
    id: 'pdf-03',
    title: 'ધોરણ ૧ થી ૫ ગણિત અને પર્યાવરણ આઈએમપી પ્રશ્નોત્તરી',
    category: 'ગણિત અને પર્યાવરણ',
    fileKey: 'maths_env_std1to5.pdf',
    fileUrl: '/api/pdfs/sample/maths_env.pdf',
    fileSize: '3.1 MB',
    uploadDate: '2026-08-05'
  },
  {
    id: 'pdf-04',
    title: 'RTE Act 2009 અને શૈક્ષણિક યોજનાઓ માર્ગદર્શિકા',
    category: 'શૈક્ષણિક યોજનાઓ',
    fileKey: 'rte_2009_handbook.pdf',
    fileUrl: '/api/pdfs/sample/rte_handbook.pdf',
    fileSize: '1.2 MB',
    uploadDate: '2026-08-08'
  }
];
