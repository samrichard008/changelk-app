import { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  Plus, 
  Download, 
  Check, 
  Lock, 
  User, 
  AlertCircle, 
  PenTool, 
  ChevronRight,
  Menu,
  X,
  Globe,
  Award,
  ShieldAlert
} from 'lucide-react';

interface Petition {
  id: string;
  title: string;
  slug: string;
  description: string;
  targetCount: number;
  currentCount: number;
  creatorId: string;
  createdAt: string;
  status: 'active' | 'closed';
  imageUrl?: string;
  signatures?: Signature[];
}

interface Signature {
  id: string;
  petitionId: string;
  fullName: string;
  phone: string;
  district: string;
  comment: string;
  signatureImageUrl: string;
  createdAt: string;
}

interface UserSession {
  id: string;
  fullName: string;
  phone: string;
  role: 'admin' | 'user';
  token?: string;
}

type Language = 'en' | 'sin' | 'tam' | 'ar';

// --- Comprehensive Translation Dictionary ---
const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    platformTitle: 'Changelk',
    platformSubtitle: 'Sovereign Public Petition Platform',
    flagshipTab: 'Save Anojan Campaign',
    exploreTab: 'Explore Petitions',
    pollsTab: 'Public Polls',
    ledgerTab: 'Public Ledger',
    startTab: 'Start a Petition',
    signIn: 'Sign In',
    logout: 'Logout',
    dashboard: 'Dashboard',
    loading: 'Loading platform data...',
    signedSuccessfully: 'Thank you for signing the petition! An account has been created for you to manage your petitions.',
    signedSuccessfullyExist: 'Thank you for signing under your profile!',
    autoAccountCreated: 'AUTOMATED ACCOUNT CREATED',
    autoAccountNote: 'Use your phone number and this temporary password to log in later:',
    keepPasswordSafe: 'Please keep this password safe, my friend.',
    errorSigning: 'An error occurred while recording your signature.',
    networkError: 'Network connection failed.',
    verifiedList: 'Verified Citizen Ledger',
    verifiedNote: 'To prove the authenticity of signatures to the Saudi Embassy and His Majesty, signatures are logged chronologically below.',
    signPetitionTitle: 'Add Your Signature',
    fullNameLabel: 'Full Name *',
    phoneLabel: 'Phone Number *',
    districtLabel: 'District / City *',
    commentLabel: 'Comments (Optional)',
    drawSignatureLabel: 'Draw your signature below',
    clearSignature: 'Clear Canvas',
    signingButtonActive: 'Recording Signature...',
    signingButton: 'Sign This Petition',
    canvasHelp: 'Use your finger or mouse to draw. Signature image is stored securely on Bunny.net CDN.',
    exploreHeading: 'Active Public Petitions',
    exploreSubheading: 'Explore campaigns launched by Sri Lankan citizens for local communities and national justice.',
    recentSignatures: 'Recent Signatures',
    noSignatures: 'No signatures registered yet.',
    viewAllLedger: 'View all verified signers on the Public Ledger',
    targetLabel: 'Target',
    completed: 'completed',
    peoplesVoice: 'The voice of the people must be heard!',
    campaignClosed: 'This campaign is closed.',
    campaignActive: 'Active Live',
    pardonAppeal: 'HUMANITARIAN APPEAL',
    urgencyHigh: 'Urgency: High',
    recipientLabel: 'Recipient',
    creatorLabel: 'Organizer',
    launchedDate: 'Launched Date',
    loginTitle: 'Sign In to Dashboard',
    loginSub: 'Use the phone number and password generated for you when you signed.',
    loginButton: 'Sign In',
    loginError: 'Invalid phone number or password.',
    startTitle: 'Start a New Petition',
    startSub: 'Stand up for justice. Launch a public petition in less than 60 seconds.',
    formTitle: 'Petition Title *',
    formDesc: 'Describe your case and why people should sign *',
    formTarget: 'Target Signatures Goal *',
    formButton: 'Launch Petition',
    formSuccess: 'Petition launched successfully! It is now visible live.',
    dashboardTitle: 'Your Advocacy Dashboard',
    dashboardSub: 'Manage your signatures, track created petitions, and export real-time ledger data.',
    createdPetitionsHeading: 'Your Created Petitions',
    signedPetitionsHeading: 'Petitions You Have Signed',
    exportCsv: 'Export to CSV',
    totalSigs: 'Total Signatures',
    successRate: 'Completion Rate',
    statusLabel: 'Status',
    recentSigsTable: 'Recent Signers Ledger',
    nameCol: 'Name',
    phoneCol: 'Phone',
    dateCol: 'Date',
    noCreatedPetitions: 'You have not started any petitions yet.',
    noSignedPetitions: 'You have not signed any petitions on this platform yet.',
    footerDesc: 'Sri Lanka’s dedicated sovereign petition and public advocacy platform. Empowering citizen voice through transparent, frictionless participation.',
    footerTrust: 'Sovereign Public Advocacy Platform · Mercy and Justice Shall Prevail',
    rights: 'All rights reserved.',
    
    // Poll keys
    pollsHeading: 'Sovereign Public Opinion Polls',
    pollsSubheading: 'Share your voice on vital legislative, community, and administrative transitions in Sri Lanka.',
    yesOption: 'Yes / Agree',
    noOption: 'No / Disagree',
    neutralOption: 'Neutral / No Opinion',
    totalVotes: 'Total Votes Recorded',
    recentVotes: 'Recent Votes Ledger',
    votedOptionLabel: 'Your Voted Option',
    voteButton: 'Submit My Vote',
    voteSuccess: 'Your vote has been recorded successfully!',
    createPollTab: 'Start a Poll',
    managedPollsHeading: 'Your Created Polls',
    votedPollsHeading: 'Polls You Have Voted On',
    exportVotesCsv: 'Export Votes as CSV',
    formPollTitle: 'Poll Question / Title *',
    formPollDesc: 'Context and background information *',
    onlyAdminAction: 'Access Denied: Only Admins can create petitions or launch public polls.',

    // Hero keys
    heroTitle: 'Democracy in the hands of the Sovereign Citizens.',
    heroDesc: 'Change.lk is Sri Lanka\'s authoritative public petition and legislative audit platform. Empowering local communities to launch humanitarian appeals, audit public policies, and sign unalterable chronological ledgers.',
    heroPillar1Title: '1. Endorse Campaigns',
    heroPillar1Desc: 'View and support critical humanitarian appeals and public welfare campaigns published by civic administrators.',
    heroPillar2Title: '2. Opinion Polls',
    heroPillar2Desc: 'Cast secure agree/disagree/neutral votes on vital national questions and local regulations.',
    heroPillar3Title: '3. Sovereign Signature',
    heroPillar3Desc: 'Draw verified signatures directly on-screen to create legal, trace-auditable citizen ledgers.',
    heroBtnExplore: 'Explore Campaigns',
    heroBtnVote: 'Direct Voting Hub',
    heroBtnLedger: 'View Public Ledger',

    // Anojan Header keys
    anojanHeaderTitle: 'SAVE ANOJAN',
    anojanHeaderSub: 'Appeal for Royal Clemency from Saudi Arabia',
    anojanHeaderDesc: 'A peaceful global petition seeking mercy, compassion, and royal clemency to save Anojan’s life.',
    anojanSignLabel: 'Signature for Anojan',
    readAppealBtn: 'Read The Appeal →',
    shareAppealBtn: 'Share This Appeal',
    motherLabel: 'Anojan\'s Mother',
    anojanLabel: 'Anojan'
  },
  sin: {
    platformTitle: 'Changelk',
    platformSubtitle: 'ස්වෛරී මහජන පෙත්සම් වේදිකාව',
    flagshipTab: 'අනෝජන් බේරාගැනීමේ මෙහෙයුම',
    exploreTab: 'වෙනත් පෙත්සම්',
    ledgerTab: 'පොදු ලෙජරය',
    startTab: 'පෙත්සමක් අරඹන්න',
    signIn: 'ඇතුල් වන්න',
    logout: 'නික්ම යන්න',
    dashboard: 'පාලක පුවරුව',
    loading: 'දත්ත පූරණය වෙමින් පවතී...',
    signedSuccessfully: 'පෙත්සමට සාර්ථකව අත්සන් තැබුවා! පෙත්සම් කළමනාකරණය සඳහා ඔබට ගිණුමක් ස්වයංක්‍රීයව නිර්මාණය කර ඇත.',
    signedSuccessfullyExist: 'ඔබේ ගිණුම යටතේ සාර්ථකව අත්සන් තැබුවා!',
    autoAccountCreated: 'ස්වයංක්‍රීයව නිර්මාණය කළ ගිණුම',
    autoAccountNote: 'පසුව ඇතුල් වීමට ඔබගේ දුරකථන අංකය සහ මෙම තාවකාලික මුරපදය භාවිතා කරන්න:',
    keepPasswordSafe: 'කරුණාකර මෙම මුරපදය සුරක්ෂිතව තබා ගන්න මචන්.',
    errorSigning: 'ඔබගේ අත්සන පටිගත කිරීමේදී දෝෂයක් ඇති විය.',
    networkError: 'ජාල සම්බන්ධතාවය අසාර්ථකයි.',
    verifiedList: 'තහවුරු කළ පුරවැසි ලෙජරය',
    verifiedNote: 'සවුදි තානාපති කාර්යාලයට සහ සවුදි රජුට අත්සන් වල විශ්වසනීයත්වය ඔප්පු කිරීම සඳහා, සියලුම අත්සන් මෙහි කාලානුක්‍රමිකව සටහන් වේ.',
    signPetitionTitle: 'ඔබගේ අත්සන එක් කරන්න',
    fullNameLabel: 'සම්පූර්ණ නම *',
    phoneLabel: 'දුරකථන අංකය *',
    districtLabel: 'දිස්ත්‍රික්කය / නගරය *',
    commentLabel: 'අදහස් (විකල්ප)',
    drawSignatureLabel: 'ඔබගේ අත්සන පහතින් අඳින්න',
    clearSignature: 'මකන්න',
    signingButtonActive: 'අත්සන පටිගත වෙමින් පවතී...',
    signingButton: 'මෙම පෙත්සමට අත්සන් කරන්න',
    canvasHelp: 'අත්සන් කිරීමට ඔබගේ ඇඟිල්ල හෝ මවුසය භාවිතා කරන්න. අත්සන Bunny.net CDN හි සුරක්ෂිතව තැන්පත් වේ.',
    exploreHeading: 'ක්‍රියාකාරී මහජන පෙත්සම්',
    exploreSubheading: 'ශ්‍රී ලාංකික පුරවැසියන් විසින් පොදු ගැටළු සහ යුක්තිය උදෙසා දියත් කරන ලද පෙත්සම්.',
    recentSignatures: 'අලුත්ම අත්සන්',
    noSignatures: 'තවමත් අත්සන් කිසිවක් ලැබී නැත.',
    viewAllLedger: 'සියලුම තහවුරු කළ අත්සන් පොදු ලෙජරයෙන් බලන්න',
    targetLabel: 'ඉලක්කය',
    completed: 'සම්පූර්ණයි',
    peoplesVoice: 'මහජන හඬට ගරු කළ යුතුය!',
    campaignClosed: 'මෙම පෙත්සම අවසන් කර ඇත.',
    campaignActive: 'සක්‍රීයයි',
    pardonAppeal: 'මානුෂීය ආයාචනය',
    urgencyHigh: 'හදිසිභාවය: ඉහළයි',
    recipientLabel: 'ලබන්නා',
    creatorLabel: 'සංවිධායක',
    launchedDate: 'ආරම්භ කළ දිනය',
    loginTitle: 'පාලක පුවරුවට ඇතුල් වන්න',
    loginSub: 'අත්සන් තැබීමේදී ඔබට ලබාදුන් දුරකථන අංකය සහ මුරපදය භාවිතා කරන්න.',
    loginButton: 'ඇතුල් වන්න',
    loginError: 'වැරදි දුරකථන අංකයක් හෝ මුරපදයක්.',
    startTitle: 'නව පෙත්සමක් අරඹන්න',
    startSub: 'යුක්තිය වෙනුවෙන් නැගී සිටින්න. තත්පර 60 කින් මහජන පෙත්සමක් සජීවී කරන්න.',
    formTitle: 'පෙත්සමේ මාතෘකාව *',
    formDesc: 'විස්තරය සහ මිනිසුන් මෙයට අත්සන් කළ යුතු හේතුව *',
    formTarget: 'අවශ්‍ය අත්සන් ගණන *',
    formButton: 'පෙත්සම දියත් කරන්න',
    formSuccess: 'පෙත්සම සාර්ථකව දියත් කරන ලදී! දැන් එය සජීවීව දැකගත හැකිය.',
    dashboardTitle: 'ඔබගේ පාලක පුවරුව',
    dashboardSub: 'ඔබගේ අත්සන් කළමනාකරණය කරන්න, ආරම්භ කළ පෙත්සම් නිරීක්ෂණය කරන්න, සහ දත්ත ලබාගන්න.',
    createdPetitionsHeading: 'ඔබ විසින් අරඹන ලද පෙත්සම්',
    signedPetitionsHeading: 'ඔබ අත්සන් කළ පෙත්සම්',
    exportCsv: 'CSV ලෙස බාගත කරන්න',
    totalSigs: 'මුළු අත්සන් ගණන',
    successRate: 'සම්පූර්ණ වීමේ ප්‍රතිශතය',
    statusLabel: 'තත්ත්වය',
    recentSigsTable: 'අත්සන් කළ අයගේ ලැයිස්තුව',
    nameCol: 'නම',
    phoneCol: 'දුරකථන අංකය',
    dateCol: 'දිනය',
    noCreatedPetitions: 'ඔබ තවමත් කිසිදු පෙත්සමක් ආරම්භ කර නොමැත.',
    noSignedPetitions: 'ඔබ තවමත් කිසිදු පෙත්සමකට අත්සන් තබා නොමැත.',
    footerDesc: 'ශ්‍රී ලංකාවේ මානුෂීය සහ පොදු සුබසාධන පෙත්සම් සඳහා වන නිල ස්වෛරී මහජන වේදිකාව.',
    footerTrust: 'ස්වෛරී මහජන පෙත්සම් වේදිකාව · කරුණාව සහ යුක්තිය ජය ගනීවා',
    rights: 'සියලුම හිමිකම් ඇවිරිණි.',

    // Hero keys
    heroTitle: 'ප්‍රජාතන්ත්‍රවාදය පරමාධිපත්‍ය බලැති පුරවැසියන්ගේ හස්තයට.',
    heroDesc: 'Change.lk යනු ශ්‍රී ලංකාවේ ප්‍රමුඛතම මහජන පෙත්සම් සහ ව්‍යවස්ථාදායක විගණන වේදිකාවයි. මානුෂීය ආයාචනා දියත් කිරීමට සහ වෙනස් කළ නොහැකි පුරවැසි ලෙජරයන් නිර්මාණය කිරීමට දේශීය ප්‍රජාවන් සවිබල ගන්වයි.',
    heroPillar1Title: '1. ව්‍යාපාර අනුමත කරන්න',
    heroPillar1Desc: 'පරිපාලකයන් විසින් පළ කරනු ලබන තීරණාත්මක මානුෂීය ආයාචනා සහ මහජන සුබසාධන ව්‍යාපාර නරඹා ඒවාට සහාය වන්න.',
    heroPillar2Title: '2. මහජන මත විමසුම්',
    heroPillar2Desc: 'වැදගත් ජාතික ගැටළු සහ ප්‍රාදේශීය රෙගුලාසි පිළිබඳව ආරක්ෂිතව ඔබගේ එකඟතාවය/එකඟ නොවීම හෝ මධ්‍යස්ථ ඡන්දය ප්‍රකාශ කරන්න.',
    heroPillar3Title: '3. ස්වෛරී අත්සන',
    heroPillar3Desc: 'නීත්‍යානුකූල සහ සොයාගත හැකි පුරවැසි ලෙජරයන් නිර්මාණය කිරීම සඳහා සෘජුවම තිරය මත ඔබගේ අත්සන ඇඳ තහවුරු කරන්න.',
    heroBtnExplore: 'පෙත්සම් ගවේෂණය කරන්න',
    heroBtnVote: 'ඡන්ද මධ්‍යස්ථානය',
    heroBtnLedger: 'පොදු ලෙජරය බලන්න',

    // Anojan Header keys
    anojanHeaderTitle: 'අනෝජන් බේරාගනිමු',
    anojanHeaderSub: 'සවුදි අරාබියෙන් රාජකීය කරුණාව සඳහා වන අභියාචනය',
    anojanHeaderDesc: 'අනෝජන්ගේ ජීවිතය බේරා ගැනීම සඳහා කරුණාව, දයාව සහ රාජකීය සමාව පතා කෙරෙන සාමකාමී ගෝලීය පෙත්සමකි.',
    anojanSignLabel: 'අනෝජන් වෙනුවෙන් අත්සන',
    readAppealBtn: 'සම්පූර්ණ අභියාචනය කියවන්න →',
    shareAppealBtn: 'මෙම අභියාචනය ශෙයා කරන්න',
    motherLabel: 'අනෝජන්ගේ මව',
    anojanLabel: 'අනෝජන්'
  },
  tam: {
    platformTitle: 'Changelk',
    platformSubtitle: 'தேசிய தன்னாதிக்க மக்கள் மனுத் தளம்',
    flagshipTab: 'அனோஜன் பிரச்சாரம் (Flagship Appeal)',
    exploreTab: 'பிற மனுக்கள் (Explore)',
    pollsTab: 'கருத்துக்கணிப்புகள்',
    ledgerTab: 'பகீரங்க லெட்ஜர் (Public Ledger)',
    startTab: 'மனுவைத் தொடங்கு (Start Petition)',
    signIn: 'உள்நுழைக',
    logout: 'வெளியேறு',
    dashboard: 'டாஷ்போர்டு',
    loading: 'தரவுகள் ஏற்றப்படுகின்றன (Loading Platform)...',
    signedSuccessfully: 'மனுவில் வெற்றிகரமாக கையொப்பமிட்டமைக்கு நன்றி! மச்சான், உங்களுக்காகப் பின்னணியில் கணக்கு உருவாக்கப்பட்டுள்ளது.',
    signedSuccessfullyExist: 'மனுவில் வெற்றிகரமாக கையொப்பமிட்டமைக்கு நன்றி!',
    autoAccountCreated: 'தானியங்கி கணக்கு உருவாக்கப்பட்டது',
    autoAccountNote: 'உள்நுழைய உங்களுடைய தொலைபேசி எண் மற்றும் இந்த தற்காலிக கடவுச்சொல்லைப் பயன்படுத்தவும்:',
    keepPasswordSafe: 'தயவுசெய்து இந்த கடவுச்சொல்லைப் பாதுகாப்பாக குறித்துக் கொள்ளவும் மச்சான்.',
    errorSigning: 'கையொப்பமிடுவதில் சிக்கல் ஏற்பட்டது. மீண்டும் முயலவும்.',
    networkError: 'இணையத் தொடர்பு துண்டிக்கப்பட்டது.',
    verifiedList: 'நம்பகத்தன்மை சரிபார்க்கப்பட்ட கையொப்பங்கள்',
    verifiedNote: 'சவூதி தூதரகத்திற்கும் சவூதி மன்னருக்கும் கையொப்பங்களின் நம்பகத்தன்மையை நிரூபிக்க, கையொப்பங்கள் அனைத்தும் காலவரிசைப்படி பகிரங்கமாக வெளியிடப்படுகின்றன.',
    signPetitionTitle: 'மனுவில் உங்களுடைய கையொப்பத்தைப் பதியுங்கள்',
    fullNameLabel: 'முழுப் பெயர் *',
    phoneLabel: 'தொலைபேசி எண் *',
    districtLabel: 'மாவட்டம் (District/City) *',
    commentLabel: 'கருத்துக்கள் (Comment - Optional)',
    drawSignatureLabel: 'உங்கள் கையொப்பத்தை வரையவும்',
    clearSignature: 'துடைக்கவும் (Clear)',
    signingButtonActive: 'பதியப்படுகிறது (Recording Signature)...',
    signingButton: 'இப்போதே கையொப்பமிடுங்கள்',
    canvasHelp: 'உங்கள் கைவிரல் அல்லது மவுஸ் கொண்டு கையொப்பமிடலாம். வரையப்பட்ட கையொப்பப்படம் Bunny.net-ல் பாதுகாப்பாகச் சேமிக்கப்படும்.',
    exploreHeading: 'மக்களை அணிதிரட்டும் இதர மனுக்கள்',
    exploreSubheading: 'இலங்கையர்கள் தங்கள் சொந்தக் கிராமங்கள் மற்றும் சமூகப் பிரச்சினைகளுக்காக முன்னெடுத்துள்ள மனுக்கள் கீழே பட்டியலிடப்பட்டுள்ளன.',
    recentSignatures: 'அண்மைய கையொப்பங்கள்',
    noSignatures: 'மனுக்களில் இதுவரை கையொப்பங்கள் எதுவும் பதியப்படவில்லை.',
    viewAllLedger: 'அனைத்து கையொப்பங்களையும் பார்வையிட பகிரங்க லெட்ஜருக்குச் செல்லவும்',
    targetLabel: 'இலக்கு',
    completed: 'நிறைவு பெற்றுள்ளது',
    peoplesVoice: 'மக்கள் குரல் மதிக்கப்பட வேண்டும்!',
    campaignClosed: 'மனு நிறைவுற்றது.',
    campaignActive: 'Active Live',
    pardonAppeal: 'மனிதாபிமான முறையீடு',
    urgencyHigh: 'நிலை: அவசரம் (High Urgency)',
    recipientLabel: 'பெறுநர்',
    creatorLabel: 'வழங்குபவர்',
    launchedDate: 'ஆரம்பிக்கப்பட்ட திகதி',
    loginTitle: 'டாஷ்போர்டில் உள்நுழைக',
    loginSub: 'மனுவில் கையொப்பமிட்டபோது உங்களுக்கு உருவாக்கப்பட்ட தொலைபேசி எண் மற்றும் ரகசிய பாஸ்வேர்ட் கொண்டு உள்நுழையுங்கள்.',
    loginButton: 'உள்நுழையுங்கள்',
    loginError: 'தவறான தொலைபேசி எண் அல்லது கடவுச்சொல்!',
    startTitle: 'புதிய பொதுமனுவைத் தொடங்குங்கள்',
    startSub: 'இலங்கையர்களுக்கு நியாயம் கிடைக்கப் போராடுங்கள். வெறும் 1 நிமிடத்தில் உங்கள் மனுவை லைவ் செய்ய முடியும்!',
    formTitle: 'மனுவின் தலைப்பு *',
    formDesc: 'முழு விபரம் மற்றும் நியாயங்கள் *',
    formTarget: 'கையொப்பங்களின் இலக்கு *',
    formButton: 'மனுவைத் தொடங்குங்கள் (Launch)',
    formSuccess: 'மனு வெற்றிகரமாகத் தொடங்கப்பட்டது! இப்போது மக்கள் அதில் கையொப்பமிடலாம்!',
    dashboardTitle: 'உங்களது டாஷ்போர்டு (Dashboard)',
    dashboardSub: 'கையெழுத்திட்ட மனுக்கள் மற்றும் நீங்கள் தொடங்கிய பிரச்சாரங்களை இங்கே நிர்வகிக்கலாம்.',
    createdPetitionsHeading: 'நீங்கள் உருவாக்கிய மனுக்கள்',
    signedPetitionsHeading: 'நீங்கள் கையொப்பமிட்ட மனுக்கள்',
    exportCsv: 'கையொப்பங்களை டவுன்லோடு செய் (Export to CSV)',
    totalSigs: 'மொத்த கையொப்பங்கள்',
    successRate: 'வெற்றி சதவிகிதம்',
    statusLabel: 'தற்போதைய நிலை',
    recentSigsTable: 'கையொப்பமிட்டோர் பட்டியல்',
    nameCol: 'பெயர்',
    phoneCol: 'தொலைபேசி எண்',
    dateCol: 'திகதி',
    noCreatedPetitions: 'நீங்கள் இதுவரை எந்தப் பொதுமனுக்களையும் ஆரம்பிக்கவில்லை.',
    noSignedPetitions: 'நீங்கள் இதுவரை தளம் மூலம் எந்தவொரு மனுவிலும் கையொப்பமிடவில்லை.',
    footerDesc: 'இலங்கையின் மனிதாபிமான, சமூக விழிப்புணர்வு மற்றும் நீதிக்கான பிரத்தியேகத் தேசிய பொதுமனுத் தளம்.',
    footerTrust: 'தேசிய தன்னாதிக்க மக்கள் மனுத் தளம் · மனிதாபிமானம் மற்றும் அறமே வெல்லும்',
    rights: 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.',
    
    // Poll keys
    pollsHeading: 'தேசிய தன்னாதிக்க கருத்துக்கணிப்புகள்',
    pollsSubheading: 'இலங்கையின் சட்டவாக்க, சமூக மற்றும் நிர்வாக ரீதியிலான முக்கியமான மாற்றங்கள் குறித்து உங்களது தன்னாதிக்கக் குரலைப் பதிவுசெய்யுங்கள்.',
    yesOption: 'விருப்பம் (ஆதரவு)',
    noOption: 'எதிர்ப்பு (எதிர்க்கிறேன்)',
    neutralOption: 'நடுநிலை / கருத்து இல்லை',
    totalVotes: 'மொத்த வாக்குப்பதிவுகள்',
    recentVotes: 'அண்மைய வாக்குப்பதிவுகள்',
    votedOptionLabel: 'உங்களது வாக்கு',
    voteButton: 'வாக்களியுங்கள்',
    voteSuccess: 'உங்கள் வாக்கு வெற்றிகரமாகப் பதியப்பட்டது!',
    createPollTab: 'கருத்துக்கணிப்பைத் தொடங்கு',
    managedPollsHeading: 'நீங்கள் உருவாக்கிய கருத்துக்கணிப்புகள்',
    votedPollsHeading: 'நீங்கள் வாக்களித்த கருத்துக்கணிப்புகள்',
    exportVotesCsv: 'வாக்குகளைத் தரவிறக்கு (CSV)',
    formPollTitle: 'கருத்துக்கணிப்புத் தலைப்பு *',
    formPollDesc: 'விபரம் மற்றும் பின்னணித் தகவல்கள் *',
    onlyAdminAction: 'அணுகல் மறுக்கப்பட்டது: மனுக்கள் மற்றும் கருத்துக்கணிப்புகளை அட்மின்கள் மட்டுமே உருவாக்க முடியும்.',

    // Hero keys
    heroTitle: 'ஜனநாயகம் தன்னாதிக்க மக்களின் கரங்களில்.',
    heroDesc: 'Change.lk என்பது இலங்கையின் அதிகாரப்பூர்வமான பொதுமனு மற்றும் சமூக விழிப்புணர்வுக்கான தளமாகும். மனிதாபிமான கோரிக்கைகளை முன்வைக்கவும், மாற்றியமைக்க முடியாத பகிரங்க லெட்ஜர்களை உருவாக்கவும் இது பொதுமக்களுக்கு வழிவகுக்கிறது.',
    heroPillar1Title: '1. பிரச்சாரங்களை ஆதரியுங்கள்',
    heroPillar1Desc: 'நிர்வாகிகளால் வெளியிடப்படும் மனிதாபிமான முறையீடுகள் மற்றும் பொதுநலப் பிரச்சாரங்களை பார்வையிட்டு ஆதரவளியுங்கள்.',
    heroPillar2Title: '2. கருத்துக்கணிப்புகள்',
    heroPillar2Desc: 'தேசிய முக்கியத்துவம் வாய்ந்த விடயங்கள் மற்றும் உள்ளூர் விதிமுறைகள் குறித்து ஆதரவாக, எதிராக அல்லது நடுநிலையாகப் பாதுகாப்பாக வாக்களியுங்கள்.',
    heroPillar3Title: '3. தன்னாதிக்க கையொப்பம்',
    heroPillar3Desc: 'சட்டபூர்வமான, நம்பகத்தன்மை வாய்ந்த குடிமக்கள் லெட்ஜர்களை உருவாக்க திரையிலேயே நேரடியாக உங்களது கையொப்பத்தை வரையுங்கள்.',
    heroBtnExplore: 'மனுக்களை ஆராய்க',
    heroBtnVote: 'வாக்குப்பதிவு மையம்',
    heroBtnLedger: 'லெட்ஜரை பார்வையிடுக',

    // Anojan Header keys
    anojanHeaderTitle: 'அனோஜனைக் காப்பாற்றுங்கள்',
    anojanHeaderSub: 'சவூதி அரேபிய மன்னரிடம் அரச பொதுமன்னிப்பு கோரிக்கை',
    anojanHeaderDesc: 'அனோஜனின் உயிரைக் காப்பாற்ற தயை, இரக்கம் மற்றும் அரச பொதுமன்னிப்பைக் கோரும் அமைதியான உலகளாவிய மனு.',
    anojanSignLabel: 'அனோஜனுக்காகக் கையொப்பம்',
    readAppealBtn: 'முழு கோரிக்கையை வாசியுங்கள் →',
    shareAppealBtn: 'இப்பிரச்சாரத்தைப் பகிருங்கள்',
    motherLabel: 'அனோஜனின் தாய்',
    anojanLabel: 'அனோஜன்'
  },
  ar: {
    platformTitle: 'Changelk',
    platformSubtitle: 'منصة العرائض الشعبية السيادية',
    flagshipTab: 'حملة إنقاذ أنوجان',
    exploreTab: 'استكشاف العرائض',
    ledgerTab: 'السجل العام',
    startTab: 'ابدأ عريضة جديدة',
    signIn: 'تسجيل الدخول',
    logout: 'تسجيل الخروج',
    dashboard: 'لوحة التحكم',
    loading: 'جاري تحميل بيانات المنصة...',
    signedSuccessfully: 'شكرًا لتوقيعكم العريضة! تم إنشاء حساب تلقائي لك لإدارة العرائض والملف الشخصي.',
    signedSuccessfullyExist: 'شكرًا لتوقيعكم العريضة تحت ملفكم الشخصي المعرّف!',
    autoAccountCreated: 'تم إنشاء حساب تلقائي بنجاح',
    autoAccountNote: 'استخدم رقم هاتفك وكلمة المرور المؤقتة هذه لتسجيل الدخول لاحقًا:',
    keepPasswordSafe: 'يرجى الاحتفاظ بكلمة المرور هذه بأمان يا صديقي.',
    errorSigning: 'حدث خطأ أثناء تسجيل توقيعكم الكريم.',
    networkError: 'فشل في الاتصال بالشبكة.',
    verifiedList: 'سجل المواطنين والموقعين الموثقين',
    verifiedNote: 'لإثبات صحة وموثوقية التوقيعات أمام سفارة المملكة العربية السعودية والمقام السامي، يتم تسجيل التوقيعات تسلسليًا أدناه.',
    signPetitionTitle: 'سجل توقيعكم الكريم هنا',
    fullNameLabel: 'الاسم الكامل *',
    phoneLabel: 'رقم الهاتف المعرّف *',
    districtLabel: 'المنطقة أو المدينة *',
    commentLabel: 'التعليق (اختياري)',
    drawSignatureLabel: 'ارسم توقيعك الكريم في المربع أدناه',
    clearSignature: 'مسح التوقيع',
    signingButtonActive: 'جاري تسجيل توقيعكم الكريم...',
    signingButton: 'وقّع على هذه العريضة',
    canvasHelp: 'استخدم إصبعك أو الماوس للتوقيع. يتم حفظ صورة التوقيع بأمان وجودة عالية.',
    exploreHeading: 'العرائض الشعبية النشطة',
    exploreSubheading: 'استكشف العرائض والمبادرات الإنسانية التي أطلقها مواطنو سريلانكا من أجل العدالة والمجتمع.',
    recentSignatures: 'التوقيعات الأخيرة المضافة',
    noSignatures: 'لا توجد توقيعات مسجلة بعد.',
    viewAllLedger: 'عرض جميع الموقعين الموثقين في السجل العام المفتوح',
    targetLabel: 'الهدف المطلوب',
    completed: 'مكتمل',
    peoplesVoice: 'صوت الشعب يستحق الاحترام والتقدير!',
    campaignClosed: 'هذه العريضة مغلقة حالياً.',
    campaignActive: 'نشط ومباشر',
    pardonAppeal: 'التماس إنساني عاجل',
    urgencyHigh: 'درجة الأهمية: قصوى عاجلة',
    recipientLabel: 'الجهة الموجه إليها',
    creatorLabel: 'المنظم والمطلق',
    launchedDate: 'تاريخ الإطلاق',
    loginTitle: 'تسجيل الدخول للوحة التحكم',
    loginSub: 'استخدم رقم الهاتف وكلمة المرور التي تم إنشاؤها لك تلقائيًا عند التوقيع.',
    loginButton: 'تسجيل الدخول',
    loginError: 'رقم الهاتف أو كلمة المرور غير صالحة.',
    startTitle: 'إطلاق عريضة عامة جديدة',
    startSub: 'دافع عن القضايا الإنسانية العادلة. أطلق عريضتك خلال أقل من 60 ثانية.',
    formTitle: 'عنوان العريضة *',
    formDesc: 'صف القضية الإنسانية والهدف من جمع التوقيعات بالتفصيل *',
    formTarget: 'العدد الإجمالي المستهدف للتوقيعات *',
    formButton: 'إطلاق العريضة العادلة',
    formSuccess: 'تم إطلاق العريضة بنجاح وهي الآن متاحة للعامة للتوقيع!',
    dashboardTitle: 'لوحة التحكم الإدارية الخاصة بك',
    dashboardSub: 'تتبع توقيعاتك الشخصية، وراقب العرائض التي أطلقتها، وصدر بيانات الموقعين مباشرة.',
    createdPetitionsHeading: 'العرائض التي قمت بإنشائها وتوجيهها',
    signedPetitionsHeading: 'العرائض التي قمت بتوقيعها وتأييدها',
    exportCsv: 'تصدير قائمة التوقيعات (CSV)',
    totalSigs: 'إجمالي التوقيعات المضافة',
    successRate: 'نسبة الإنجاز الفعلي',
    statusLabel: 'الحالة الحالية',
    recentSigsTable: 'سجل التوقيعات الحية الأخيرة',
    nameCol: 'الاسم',
    phoneCol: 'الهاتف',
    dateCol: 'التاريخ',
    noCreatedPetitions: 'لم تقم بإنشاء أو إطلاق أي عريضة عامة حتى الآن.',
    noSignedPetitions: 'لم تقم بتأييد أو توقيع أي عريضة عامة على هذه المنصة حتى الآن.',
    footerDesc: 'منصة العرائض السيادية والإنسانية المخصصة لجمهورية سريلانكا. تمكين الأصوات الوطنية بكل شفافية وموثوقية عالية.',
    footerTrust: 'المنصة الوطنية للعرائض العامة السيادية · الرحمة والعدل هما الغالبان دائمًا',
    rights: 'جميع الحقوق محفوظة.',

    // Hero keys
    heroTitle: 'الديمقراطية في أيدي المواطنين السياديين.',
    heroDesc: 'Change.lk هي منصة العرائض الشعبية والرقابة السيادية في سريلانكا. تمكين المجتمعات المحلية من إطلاق الالتماسات الإنسانية والرقابة العامة وتوقيع السجلات السيادية الموثقة والمحمية.',
    heroPillar1Title: '١. تأييد الحملات',
    heroPillar1Desc: 'عرض ودعم الالتماسات الإنسانية الحرجة وحملات الرعاية العامة التي يطلقها المشرفون المدنيون الموثقون.',
    heroPillar2Title: '٢. استطلاعات الرأي',
    heroPillar2Desc: 'التصويت بأمان بنعم/لا/محايد على الأسئلة الوطنية الحيوية والقضايا المجتمعية المعروضة.',
    heroPillar3Title: '٣. التوقيع السيادي',
    heroPillar3Desc: 'ارسم توقيعك الموثق مباشرة على الشاشة لإنشاء سجلات مواطنين قانونية وقابلة للتدقيق الكامل والشفاف.',
    heroBtnExplore: 'استكشاف الحملات',
    heroBtnVote: 'مركز التصويت المباشر',
    heroBtnLedger: 'عرض السجل العام',

    // Anojan Header keys
    anojanHeaderTitle: 'أنقذوا أنوجان',
    anojanHeaderSub: 'التماس العفو والرحمة الملكية من المملكة العربية السعودية',
    anojanHeaderDesc: 'التماس عالمي سلمي يطلب الرحمة والعفو الملكي الكريم لحفظ حياة الابن الشاب أنوجان وعودته لأهله.',
    anojanSignLabel: 'توقيع من أجل أنوجان',
    readAppealBtn: 'اقرأ الالتماس الكامل ←',
    shareAppealBtn: 'مشاركة هذا الالتماس',
    motherLabel: 'والدة أنوجان',
    anojanLabel: 'أنوجان'
  }
};

// --- Multi-language Petition Content Dictionary ---
const PETITION_CONTENT: Record<Language, Record<string, { title: string; description: string }>> = {
  en: {
    'save-anojan': {
      title: 'Save Anojan: Appeal for Presidential Pardon & Royal Clemency from Saudi Arabia',
      description: `This international public petition campaign is launched to secure a humanitarian Royal Clemency and Presidential Pardon for Anojan, a young Sri Lankan citizen currently facing a death sentence in the Kingdom of Saudi Arabia.

Anojan, hailing from a vulnerable background in Jaffna, Sri Lanka, migrated to Saudi Arabia as a domestic laborer to support his impoverished family. Due to a series of tragic, highly unintended, and unfortunate circumstances, he was convicted and sentenced.

His grieving family, along with the entire citizenry of Sri Lanka and global humanitarians, make a solemn, peaceful appeal of mercy to His Majesty King Salman bin Abdulaziz Al Saud, the Royal Court, and the Saudi judicial authorities to grant royal mercy and commute his sentence.

**Our Clear Objectives:**
1. We appeal to the exceptional mercy of His Majesty the King of Saudi Arabia to grant Anojan a Royal Clemency on compassionate grounds.
2. We urge the President and Ministry of Foreign Affairs of Sri Lanka to immediately accelerate top-level bilateral diplomatic mediation with the Saudi Government to save Anojans life.

Every single signature adds a beacon of hope and strength. Please sign and share this humanitarian appeal to help return Anojan safely to his elderly parents.`
    },
    'protect-hikkaduwa-coral-reefs': {
      title: "Protect Sri Lanka's Coral Reefs in Hikkaduwa from Commercial Boating",
      description: `Hikkaduwa Marine Sanctuary is facing critical degradation due to plastic pollution, illegal anchoring, and rising sea temperatures. This petition urges the Department of Wildlife Conservation (DWC) to declare the area a strict marine reserve and restrict commercial motorized boating inside the shallow lagoon. 

Our coral reefs are an irreplaceable natural treasure and key to Sri Lanka's marine tourism. We must protect them before they are completely bleached and destroyed.`
    },
    'safe-transport-colombo': {
      title: 'Introduce Safer CCTV-Monitored Public Transport Options for Women in Colombo',
      description: `Over 80% of women using public buses and trains in Colombo report facing verbal or physical harassment during transit. We appeal to the Ministry of Transport and Highways to introduce dedicated CCTV-monitored compartments, trained transit marshals, and a direct emergency reporting hotline. 

Safe transit is a fundamental right of every citizen. Let us build a safer Colombo for our mothers, sisters, and daughters.`
    }
  },
  sin: {
    'save-anojan': {
      title: 'අනෝජන් බේරාගන්න: සවුදි අරාබියෙන් ජනාධිපති සමාව සහ රාජකීය කරුණාව සඳහා වන අභියාචනය',
      description: `දැනට සවුදි අරාබි රාජධානියේ මරණ දණ්ඩනයට නියම වී සිටින තරුණ ශ්‍රී ලාංකික පුරවැසියෙකු වන අනෝජන් සඳහා මානුෂීය රාජකීය සමාව ලබා ගැනීම සඳහා මෙම ජාත්‍යන්තර මහජන පෙත්සම් ව්‍යාපාරය දියත් කර ඇත.

යාපනයේ අතිශය දුප්පත් පවුලක උපන් අනෝජන්, තම පවුල නඩත්තු කිරීම සඳහා සවුදි අරාබියට ගෘහස්ථ සේවකයෙකු ලෙස සංක්‍රමණය විය. එහිදී සිදු වූ අවාසනාවන්ත හා නොවැළැක්විය හැකි සිදුවීම් මාලාවක් හේතුවෙන් ඔහු වරදකරු වී දඬුවම් නියම විය.

ඔහුගේ පවුලේ අය සහ ශ්‍රී ලාංකික මහජනතාව, සවුදි අරාබියේ සල්මාන් බින් අබ්දුල්අසීස් රජුගෙන් සහ රාජකීය අධිකරණයෙන් අනෝජන් නිදහස් කර දෙන ලෙස ඉල්ලා සිටිති.

**අපගේ ප්‍රධාන අරමුණු:**
1. අනෝජන්ට මානුෂීය පදනමක් මත රාජකීය සමාව ලබා දෙන ලෙස සවුදි අරාබියේ ශ්‍රීමත් රජුගෙන් අපි ගෞරවයෙන් ඉල්ලා සිටිමු.
2. අනෝජන්ගේ ජීවිතය බේරා ගැනීම සඳහා ශ්‍රී ලංකා ජනාධිපතිවරයා සහ විදේශ කටයුතු අමාත්‍යාංශය වහාම සවුදි රජය සමඟ ඉහළ මට්ටමේ ද්විපාර්ශ්වික රාජ්‍ය තාන්ත්‍රික මැදිහත්වීමක් සිදු කළ යුතුය.`
    },
    'protect-hikkaduwa-coral-reefs': {
      title: 'හික්කඩුව කොරල්පර වාණිජ බෝට්ටු සේවාවලින් ආරක්ෂා කර ගැනීම',
      description: `හික්කඩුව සමුද්‍ර අභයභූමිය ප්ලාස්ටික් දූෂණය, නීතිවිරෝධී නැංගුරම් ලෑම සහ මුහුදු උෂ්ණත්වය ඉහළ යාම හේතුවෙන් දැඩි ලෙස විනාශ වෙමින් පවතී. මෙම ප්‍රදේශය දැඩි සමුද්‍ර රක්ෂිතයක් ලෙස ප්‍රකාශයට පත් කරන ලෙසත් වාණිජ බෝට්ටු ධාවනය සීමා කරන ලෙසත් වනජීවී සංරක්ෂණ දෙපාර්තමේන්තුවෙන් අපි ඉල්ලා සිටිමු.`
    },
    'safe-transport-colombo': {
      title: 'කොළඹ කාන්තාවන් සඳහා සුරක්ෂිත පොදු ප්‍රවාහන සේවා හඳුන්වා දීම',
      description: `කොළඹ පොදු බස් රථ සහ දුම්රිය භාවිතා කරන කාන්තාවන්ගෙන් 80% කට වඩා වැඩි ප්‍රමාණයක් විවිධ හිරිහැරවලට මුහුණ දෙන බව වාර්තා වේ. ආරක්ෂිත කැමරා (CCTV) සහිත විශේෂ මැදිරි සහ කාන්තා ආරක්ෂක නිලධාරීන් ප්‍රවාහන සේවා සඳහා එක් කරන ලෙස අපි ප්‍රවාහන අමාත්‍යාංශයෙන් ඉල්ලා සිටිමු.`
    }
  },
  tam: {
    'save-anojan': {
      title: 'Save Anojan: அனோஜன் தம்பியின் உயிரைக் காப்பாற்ற சவூதி மன்னரிடம் மனிதாபிமான பொதுமன்னிப்பு கோரிக்கை',
      description: `அனோஜன் (Anojan) என்ற இளம் இலங்கைத் தமிழரின் உயிரைக் காப்பாற்ற சவூதி மன்னரிடம் பொதுமன்னிப்பு கோரி இந்த சர்வதேச மனுப் பிரசாரம் முன்னெடுக்கப்படுகிறது.

அனோஜன் இலங்கையின் யாழ்ப்பாணத்தைச் சேர்ந்தவர். குடும்ப வறுமையின் காரணமாக சவூதி அரேபியாவிற்குப் பணிப் பெண்ணின் மகனாகச் சென்று உழைக்கத் தொடங்கினார். அங்கு எதிர்பாராத விபத்து மற்றும் சூழ்நிலை காரணமாக அவருக்கு மரண தண்டனை விதிக்கப்பட்டுள்ளது.

அவரது குடும்பமும் ஒட்டுமொத்த இலங்கையர்களும் சவூதி மன்னர் சல்மான் பின் அப்துல்அஜிஸ் (King Salman bin Abdulaziz Al Saud) அவர்களுக்கும், சவூதி அரேபிய அரச குடும்பத்திற்கும் மனிதாபிமான அடிப்படையில் பொதுமன்னிப்பு வழங்கி அனோஜனை விடுதலை செய்யுமாறு மன்றாடிப் பிரார்த்திக்கின்றனர்.

**நாம் கோருவது:**
1. மாண்புமிகு சவூதி மன்னர் அனோஜன் தம்பிக்கு தனது மேலான அரச பொதுமன்னிப்பை (Royal Clemency) வழங்க வேண்டும்.
2. இலங்கை ஜனாதிபதி மற்றும் வெளிவிவகார அமைச்சு உடனடியாக சவூதி தூதரகத்துடன் உயர்மட்ட இராஜதந்திர பேச்சுவார்த்தைகளை (Diplomatic Mediation) முன்னெடுக்க வேண்டும்.

ஒவ்வொரு கையொப்பமும் அனோஜனின் உயிரைக் காக்கும் ஒரு மாபெரும் சக்தியாக மாறும். தயவுசெய்து உங்கள் கையொப்பத்தைப் பதிவுசெய்து, அனோஜனை மீட்டுத் தர உதவுங்கள்.`
    },
    'protect-hikkaduwa-coral-reefs': {
      title: "இலங்கையின் ஹிக்கடுவ பவளப்பாறைகளை வணிகப் படகுகளிலிருந்து பாதுகாத்தல்",
      description: `ஹிக்கடுவ கடல்சார் சரணாலயம் பிளாஸ்டிக் மாசுபாடு, சட்டவிரோத நங்கூரமிடுதல் மற்றும் கடல் வெப்பநிலை உயர்வு ஆகியவற்றால் கடுமையான அழிவைச் சந்தித்து வருகிறது. இந்த பவளப்பாறைகளை வணிகப் படகுச் சேவைகளிலிருந்து பாதுகாக்குமாறு வனவிலங்கு பாதுகாப்புத் திணைக்களத்திடம் இந்த மனு மூலம் கேட்டுக்கொள்கிறோம்.`
    },
    'safe-transport-colombo': {
      title: 'கொழும்பில் பெண்களுக்கான பாதுகாப்பான பொது போக்குவரத்து வசதிகள்',
      description: `கொழும்பு பொதுப் பேருந்துகள் மற்றும் ரயில்களில் பயணிக்கும் பெண்களில் 80% க்கும் அதிகமானோர் பல்வேறு தொல்லைகளுக்கு உள்ளாகின்றனர். பெண்களுக்கான பிரத்தியேகப் பாதுகாப்புப் பெட்டிகள் மற்றும் CCTV கண்காணிப்பு அமைப்புகளை உருவாக்குமாறு போக்குவரத்து அமைச்சிடம் கோரிக்கை விடுக்கிறோம்.`
    }
  },
  ar: {
    'save-anojan': {
      title: 'أنقذوا أنوجان: التماس العفو الإنساني والرحمة الملكية الكريمة من المقام السامي بالمملكة العربية السعودية',
      description: `تطلق هذه الحملة الإنسانية الدولية لالتماس العفو الملكي والرحمة الأبوية الكريمة من لدن خادم الحرمين الشريفين الملك سلمان بن عبد العزيز آل سعود - حفظه الله - للشاب السريلانكي أنوجان الذي يواجه حكماً بالقصاص في المملكة العربية السعودية.

أنوجان، ينتمي لعائلة مكافحة وفقيرة في مدينة جافنا بسريلانكا، سافر كعامل منزلي بسيط لإعانة عائلته وسد رمق عيشهم. وقد تعرض لظروف وملابسات مأساوية وقاهرة غير مقصودة تماماً أدت لإدانته قانونياً.

إن عائلته المكلومة والآلاف من شعب سريلانكا والناشطين الإنسانيين حول العالم يرفعون هذا الالتماس السلمي المفعم بالرجاء إلى مقام خادم الحرمين الشريفين الملك سلمان، والحكومة السعودية الرشيدة، لطلب العفو الملكي الكريم والرحمة الإنسانية المعتادة من ولاة الأمر في المملكة.

**مطالبنا وأهدافنا الإنسانية:**
١. نلتمس ببالغ الرجاء والأمل الرحمة المعهودة والجميلة من لدن خادم الحرمين الشريفين لإصدار عفو ملكي كريم عن الابن الشاب أنوجان لأسباب إنسانية وصغر سنه وعوز أسرته.
٢. نحث فخامة رئيس جمهورية سريلانكا ووزارة الخارجية على تكثيف الجهود الدبلوماسية الرسمية الثنائية مع الأشقاء في المملكة العربية السعودية لتسهيل هذا المسعى الإنساني النبيل وحفظ حياة الشاب.`
    },
    'protect-hikkaduwa-coral-reefs': {
      title: 'حماية الشعاب المرجانية الفريدة في هيكادوا بسريلانكا من قوارب النقل التجارية ومخلفاتها',
      description: `تتعرض المحمية البحرية الطبيعية في هيكادوا لتهديد حرج بسبب التلوث البلاستيكي وإلقاء الراسي بشكل عشوائي وارتفاع درجات حرارة البحر. تطالب هذه العريضة إدارة حماية الحياة البرية بإعلان المنطقة محمية طبيعية صارمة وتقييد القوارب البخارية التجارية الضارة داخل البحيرة البحرية الضحلة حفاظاً عليها للأجيال.`
    },
    'safe-transport-colombo': {
      title: 'إدخال وسائل نقل عام آمنة ومراقبة بالكاميرات لخدمة وحماية النساء في كولومبو',
      description: `تشير التقارير إلى أن أكثر من ٨٠٪ من النساء اللواتي يستخدمن الحافلات والقطارات العامة في كولومبو يتعرضن لمضايقات لفظية أو جسدية أثناء التنقل. نناشد وزارة النقل بإنشاء مقصورات مخصصة للنساء ومراقبة بالكامل بالكاميرات مع تعيين حراسة أمنية معرّفة لحماية أمهاتنا وأخواتنا وبناتنا.`
    }
  }
};

export default function App() {
  // Navigation & View States
  const [activeTab, setActiveTab] = useState<'home' | 'explore' | 'polls' | 'ledger' | 'start' | 'dashboard' | 'login'>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en'); // Default is English
  
  // Data States
  const [petitions, setPetitions] = useState<Petition[]>([]);
  const [selectedPetitionSlug, setSelectedPetitionSlug] = useState<string>('save-anojan');
  const [selectedPetition, setSelectedPetition] = useState<Petition | null>(null);
  const [loading, setLoading] = useState(true);
  const [submittingSignature, setSubmittingSignature] = useState(false);
  
  // Poll States
  const [polls, setPolls] = useState<any[]>([]);
  const [selectedPollId, setSelectedPollId] = useState<string>('poll-1');
  const [submittingVote, setSubmittingVote] = useState(false);
  const [voteOption, setVoteOption] = useState<'yes' | 'no' | 'neutral'>('yes');
  
  // Create Poll Form States
  const [newPollTitle, setNewPollTitle] = useState('');
  const [newPollDescription, setNewPollDescription] = useState('');
  const [newPollImageUrl, setNewPollImageUrl] = useState('');
  const [createPollError, setCreatePollError] = useState('');
  const [createPollSuccess, setCreatePollSuccess] = useState(false);
  
  // Signature Form States
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [district, setDistrict] = useState('Colombo');
  const [comment, setComment] = useState('');
  
  // Auth States
  const [session, setSession] = useState<UserSession | null>(null);
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // Create Petition Form States
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newTargetCount, setNewTargetCount] = useState('50000');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageBase64, setNewImageBase64] = useState('');
  const [createError, setCreateError] = useState('');
  const [createSuccess, setCreateSuccess] = useState(false);
  const [startMode, setStartMode] = useState<'campaign' | 'poll'>('campaign');

  // Edit Campaign Form States
  const [isEditingCampaign, setIsEditingCampaign] = useState(false);
  const [editCampaignTitle, setEditCampaignTitle] = useState('');
  const [editCampaignDescription, setEditCampaignDescription] = useState('');
  const [editCampaignTargetCount, setEditCampaignTargetCount] = useState('');
  const [editCampaignImageUrl, setEditCampaignImageUrl] = useState('');
  const [editCampaignImageBase64, setEditCampaignImageBase64] = useState('');
  const [editCampaignError, setEditCampaignError] = useState('');

  // Edit Poll Form States
  const [isEditingPoll, setIsEditingPoll] = useState(false);
  const [editPollTitle, setEditPollTitle] = useState('');
  const [editPollDescription, setEditPollDescription] = useState('');
  const [editPollImageUrl, setEditPollImageUrl] = useState('');
  const [editPollError, setEditPollError] = useState('');

  // Success Toast & Auto-Auth Modal states
  const [successToast, setSuccessToast] = useState<{ show: boolean; message: string; autoPass?: string } | null>(null);

  // Canvas Reference
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Sri Lankan Districts for Dropdown
  const districts = [
    'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya', 
    'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar', 
    'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee', 
    'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla', 
    'Moneragala', 'Ratnapura', 'Kegalle'
  ];

  // Helper method to retrieve localized text
  const t = (key: string): string => {
    return TRANSLATIONS[currentLanguage][key] || TRANSLATIONS['en'][key] || key;
  };

  // Helper method to retrieve English-only text for navigation elements
  const tNav = (key: string): string => {
    return TRANSLATIONS['en'][key] || key;
  };

  // Helper method to get localized petition content
  const getPetitionContent = (slug: string, fallbackTitle: string, fallbackDesc: string) => {
    const loc = PETITION_CONTENT[currentLanguage]?.[slug];
    return {
      title: loc?.title || fallbackTitle,
      description: loc?.description || fallbackDesc
    };
  };

  // Fetch all petitions and detailed current petition
  const fetchPetitions = async () => {
    try {
      const res = await fetch('/api/petitions');
      if (res.ok) {
        const data = await res.json();
        setPetitions(data);
      }
    } catch (err) {
      console.error('Failed to fetch petitions:', err);
    }
  };

  const fetchDetailedPetition = async (slug: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/petitions/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedPetition(data);
      }
    } catch (err) {
      console.error('Failed to fetch petition details:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPolls = async () => {
    try {
      const res = await fetch('/api/polls');
      if (res.ok) {
        const data = await res.json();
        setPolls(data);
      }
    } catch (err) {
      console.error('Failed to fetch polls:', err);
    }
  };

  useEffect(() => {
    fetchPetitions();
    fetchPolls();
    // Retrieve cached login session if present
    const cached = localStorage.getItem('change_lk_session');
    if (cached) {
      try {
        setSession(JSON.parse(cached));
      } catch (e) {
        localStorage.removeItem('change_lk_session');
      }
    }
  }, []);

  useEffect(() => {
    fetchDetailedPetition(selectedPetitionSlug);
  }, [selectedPetitionSlug]);

  // Canvas Drawing Handlers (Frictionless Touch and Mouse support)
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = '#1c1917'; // Antique charcoal
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      // Prevent scrolling while signing on mobile
      if (e.cancelable) e.preventDefault();
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
    setHasDrawn(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  // Submit Signature Handler with Frictionless Auto Account Creation
  const handleSignPetition = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !district) {
      alert(currentLanguage === 'tam' ? 'தயவுசெய்து அனைத்து விபரங்களையும் பூர்த்தி செய்யவும்.' : 'Please fill in all required fields.');
      return;
    }

    setSubmittingSignature(true);
    let signatureBase64 = '';

    if (canvasRef.current && hasDrawn) {
      signatureBase64 = canvasRef.current.toDataURL('image/png');
    }

    try {
      const response = await fetch(`/api/petitions/${selectedPetition?.id}/sign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName,
          phone,
          district,
          comment,
          signatureBase64
        })
      });

      const result = await response.json();

      if (response.ok) {
        // Increment count locally immediately for responsive feedback
        if (selectedPetition) {
          setSelectedPetition({
            ...selectedPetition,
            currentCount: selectedPetition.currentCount + 1,
            signatures: [
              {
                id: 'sig_temp_' + Date.now(),
                petitionId: selectedPetition.id,
                fullName,
                phone,
                district,
                comment,
                signatureImageUrl: result.signatureImageUrl || 'https://api.dicebear.com/7.x/initials/svg?seed=' + fullName,
                createdAt: new Date().toISOString()
              },
              ...(selectedPetition.signatures || [])
            ]
          });
        }

        // Show elegant success toast using translated strings
        if (result.accountCreated) {
          setSuccessToast({
            show: true,
            message: `${t('signedSuccessfully')} Account created! Phone: ${phone}, Password: ${result.generatedPassword}`,
            autoPass: result.generatedPassword
          });
          
          // Auto log in the user with secure token
          const autoSession: UserSession = { ...result.user, token: result.token };
          setSession(autoSession);
          localStorage.setItem('change_lk_session', JSON.stringify(autoSession));
        } else {
          setSuccessToast({
            show: true,
            message: t('signedSuccessfullyExist')
          });
        }

        // Clear Form fields
        setFullName('');
        setPhone('');
        setComment('');
        clearCanvas();
        fetchPetitions(); // refresh counts across tabs
      } else {
        alert(result.error || t('errorSigning'));
      }
    } catch (err) {
      console.error(err);
      alert(t('networkError'));
    } finally {
      setSubmittingSignature(false);
    }
  };

  // Handle standard user login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginPhone.trim() || !loginPassword.trim()) {
      setLoginError(t('loginError'));
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: loginPhone, password: loginPassword })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        const loggedSession: UserSession = { ...data.user, token: data.token };
        setSession(loggedSession);
        localStorage.setItem('change_lk_session', JSON.stringify(loggedSession));
        setActiveTab('dashboard');
        setLoginPhone('');
        setLoginPassword('');
      } else {
        setLoginError(data.error || t('loginError'));
      }
    } catch (err) {
      setLoginError(t('networkError'));
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle new petition creation (Strict Admin Only check!)
  const handleCreatePetition = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');
    setCreateSuccess(false);

    if (!session || session.role !== 'admin') {
      setCreateError(t('onlyAdminAction'));
      return;
    }

    if (!newTitle.trim() || !newDescription.trim() || !newTargetCount.trim()) {
      setCreateError('Please fill in all required fields.');
      return;
    }

    try {
      const res = await fetch('/api/petitions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.token || ''}`
        },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
          targetCount: parseInt(newTargetCount, 10),
          creatorId: session.id,
          imageUrl: newImageUrl,
          imageBase64: newImageBase64
        })
      });

      const data = await res.json();

      if (res.ok) {
        setCreateSuccess(true);
        setNewTitle('');
        setNewDescription('');
        setNewImageUrl('');
        setNewImageBase64('');
        fetchPetitions();
        // Redirect to detailed view of new petition
        setSelectedPetitionSlug(data.petition.slug);
        setActiveTab('home');
      } else {
        setCreateError(data.error || 'Failed to launch petition.');
      }
    } catch (err) {
      setCreateError(t('networkError'));
    }
  };

  // Submit Vote on Poll with Frictionless Account Creation
  const handleVotePoll = async (e: React.FormEvent, pollId: string) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !voteOption) {
      alert(currentLanguage === 'tam' ? 'தயவுசெய்து அனைத்து விபரங்களையும் பூர்த்தி செய்யவும்.' : 'Please fill in all required fields.');
      return;
    }

    setSubmittingVote(true);
    let signatureBase64 = '';

    if (canvasRef.current && hasDrawn) {
      signatureBase64 = canvasRef.current.toDataURL('image/png');
    }

    try {
      const response = await fetch(`/api/polls/${pollId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName,
          phone,
          option: voteOption,
          district,
          comment,
          signatureBase64
        })
      });

      const result = await response.json();

      if (response.ok) {
        if (result.accountCreated) {
          setSuccessToast({
            show: true,
            message: `${t('voteSuccess')} மச்சான், உங்களுக்காகப் பின்னணியில் கணக்கு உருவாக்கப்பட்டுள்ளது. (Your vote is recorded! An account has been created for you.)`,
            autoPass: result.tempPassword
          });
          
          const autoSession: UserSession = { ...result.user, token: result.token };
          setSession(autoSession);
          localStorage.setItem('change_lk_session', JSON.stringify(autoSession));
        } else {
          setSuccessToast({
            show: true,
            message: t('voteSuccess')
          });
        }

        setFullName('');
        setPhone('');
        setComment('');
        clearCanvas();
        fetchPolls(); // Refresh poll scores
      } else {
        alert(result.error || 'வாக்குப்பதிவு தோல்வியடைந்தது.');
      }
    } catch (err) {
      console.error(err);
      alert(t('networkError'));
    } finally {
      setSubmittingVote(false);
    }
  };

  // Handle new poll creation (Admin Only)
  const handleCreatePoll = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatePollError('');
    setCreatePollSuccess(false);

    if (!session || session.role !== 'admin') {
      setCreatePollError(t('onlyAdminAction'));
      return;
    }

    if (!newPollTitle.trim() || !newPollDescription.trim()) {
      setCreatePollError('Please fill in all required fields.');
      return;
    }

    try {
      const res = await fetch('/api/polls', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.token || ''}`
        },
        body: JSON.stringify({
          title: newPollTitle,
          description: newPollDescription,
          imageUrl: newPollImageUrl,
          creatorId: session.id
        })
      });

      const data = await res.json();

      if (res.ok) {
        setCreatePollSuccess(true);
        setNewPollTitle('');
        setNewPollDescription('');
        setNewPollImageUrl('');
        fetchPolls();
        setActiveTab('polls');
      } else {
        setCreatePollError(data.error || 'Failed to create poll.');
      }
    } catch (err) {
      setCreatePollError(t('networkError'));
    }
  };

  // Administrative Campaign Edit Handler
  const handleEditCampaignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPetition || !session || session.role !== 'admin') return;

    try {
      const res = await fetch(`/api/petitions/${selectedPetition.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.token || ''}`
        },
        body: JSON.stringify({
          title: editCampaignTitle,
          description: editCampaignDescription,
          targetCount: parseInt(editCampaignTargetCount, 10),
          imageUrl: editCampaignImageUrl,
          imageBase64: editCampaignImageBase64,
          creatorId: session.id
        })
      });

      const data = await res.json();
      if (res.ok) {
        setIsEditingCampaign(false);
        setEditCampaignImageBase64('');
        // Refresh petitions
        fetchPetitions();
        // Update local loaded petition state
        setSelectedPetition(data.petition);
        setSelectedPetitionSlug(data.petition.slug);
        setSuccessToast({ show: true, message: 'Campaign edited successfully!' });
      } else {
        setEditCampaignError(data.error || 'Failed to edit campaign.');
      }
    } catch (err) {
      setEditCampaignError('Network error occurred.');
    }
  };

  // Administrative Campaign Delete Handler
  const handleDeleteCampaign = async () => {
    if (!selectedPetition || !session || session.role !== 'admin') return;
    const confirmed = window.confirm('Are you absolutely sure you want to delete this campaign? All signatures and progress will be permanently lost.');
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/petitions/${selectedPetition.id}?creatorId=${session.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session?.token || ''}`
        }
      });

      if (res.ok) {
        setSuccessToast({ show: true, message: 'Campaign deleted successfully!' });
        fetchPetitions();
        setSelectedPetition(null);
        setSelectedPetitionSlug('save-anojan');
        setActiveTab('home');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete campaign.');
      }
    } catch (err) {
      alert('Network error occurred.');
    }
  };

  // Administrative Poll Edit Handler
  const handleEditPollSubmit = async (e: React.FormEvent, pollId: string) => {
    e.preventDefault();
    if (!session || session.role !== 'admin') return;

    try {
      const res = await fetch(`/api/polls/${pollId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.token || ''}`
        },
        body: JSON.stringify({
          title: editPollTitle,
          description: editPollDescription,
          imageUrl: editPollImageUrl,
          creatorId: session.id
        })
      });

      const data = await res.json();
      if (res.ok) {
        setIsEditingPoll(false);
        fetchPolls();
        setSuccessToast({ show: true, message: 'Poll edited successfully!' });
      } else {
        setEditPollError(data.error || 'Failed to edit poll.');
      }
    } catch (err) {
      setEditPollError('Network error occurred.');
    }
  };

  // Administrative Poll Delete Handler
  const handleDeletePoll = async (pollId: string) => {
    if (!session || session.role !== 'admin') return;
    const confirmed = window.confirm('Are you absolutely sure you want to delete this opinion poll? All votes and progress will be permanently lost.');
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/polls/${pollId}?creatorId=${session.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session?.token || ''}`
        }
      });

      if (res.ok) {
        setSuccessToast({ show: true, message: 'Opinion poll deleted successfully!' });
        fetchPolls();
        setSelectedPollId('');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete poll.');
      }
    } catch (err) {
      alert('Network error.');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setSession(null);
    localStorage.removeItem('change_lk_session');
    setActiveTab('home');
  };

  // Format big numbers gracefully with comma separators
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  // Get active user dashboard details
  const [dashboardData, setDashboardData] = useState<{ signedPetitions: Petition[]; managedCampaigns: (Petition & { signatures: Signature[] })[] } | null>(null);
  const [loadingDashboard, setLoadingDashboard] = useState(false);

  useEffect(() => {
    if (session && activeTab === 'dashboard') {
      setLoadingDashboard(true);
      fetch(`/api/dashboard/${session.id}`, {
        headers: {
          'Authorization': `Bearer ${session?.token || ''}`
        }
      })
        .then(res => res.json())
        .then(data => {
          setDashboardData(data);
          setLoadingDashboard(false);
        })
        .catch(err => {
          console.error(err);
          setLoadingDashboard(false);
        });
    }
  }, [session, activeTab]);

  return (
    <div className={`min-h-screen flex flex-col font-sans bg-[#FAF9F6] ${currentLanguage === 'ar' ? 'rtl text-right' : 'ltr'}`}>
      
      {/* Top Bar Contract (Single Row, 3 Zones: Brand wordmark — 4-6 Nav links — 1-2 actions) */}
      <header className="sticky top-0 z-50 bg-[#FAF9F6] border-b border-stone-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Zone 1: Brand Wordmark (Single text element) */}
          <div className="flex items-center gap-3 shrink-0">
            <span 
              onClick={() => { setSelectedPetitionSlug('save-anojan'); setActiveTab('home'); }}
              className="text-2xl font-serif font-bold tracking-tight text-stone-900 cursor-pointer"
            >
              {tNav('platformTitle')}
            </span>
            <span className="hidden lg:inline-block text-xs font-serif italic text-stone-400 border-l border-stone-200 pl-3">
              {tNav('platformSubtitle')}
            </span>
          </div>

          {/* Zone 2: Navigation Links (Clean unboxed text) */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-stone-600">
            <button 
              onClick={() => { setSelectedPetitionSlug('save-anojan'); setActiveTab('home'); }} 
              className={`hover:text-stone-950 transition-colors ${activeTab === 'home' && selectedPetitionSlug === 'save-anojan' ? 'text-stone-950 underline decoration-[#9A3412] underline-offset-4' : ''}`}
            >
              {tNav('flagshipTab')}
            </button>
            <button 
              onClick={() => setActiveTab('explore')} 
              className={`hover:text-stone-950 transition-colors ${activeTab === 'explore' ? 'text-stone-950 underline decoration-[#9A3412] underline-offset-4' : ''}`}
            >
              {tNav('exploreTab')}
            </button>
            <button 
              onClick={() => setActiveTab('polls')} 
              className={`hover:text-stone-950 transition-colors ${activeTab === 'polls' ? 'text-stone-950 underline decoration-[#9A3412] underline-offset-4' : ''}`}
            >
              {tNav('pollsTab')}
            </button>
            <button 
              onClick={() => setActiveTab('ledger')} 
              className={`hover:text-stone-950 transition-colors ${activeTab === 'ledger' ? 'text-stone-950 underline decoration-[#9A3412] underline-offset-4' : ''}`}
            >
              {tNav('ledgerTab')}
            </button>
            {session?.role === 'admin' && (
              <button 
                onClick={() => setActiveTab('start')} 
                className={`hover:text-stone-950 transition-colors ${activeTab === 'start' ? 'text-stone-950 underline decoration-[#9A3412] underline-offset-4' : ''}`}
              >
                {tNav('startTab')}
              </button>
            )}
          </nav>

          {/* Zone 3: Active Language Switcher & User Actions */}
          <div className="flex items-center gap-3 shrink-0">
            
            {/* Elegant Language Switcher view (en / sin / tam / ar) */}
            <div className="flex items-center gap-1 bg-stone-150 p-1 rounded-lg border border-stone-200/50 text-[10px] font-bold">
              <button 
                onClick={() => setCurrentLanguage('en')}
                className={`px-2 py-1 rounded transition-colors ${currentLanguage === 'en' ? 'bg-[#9A3412] text-white' : 'text-stone-600 hover:text-stone-950'}`}
              >
                EN
              </button>
              <button 
                onClick={() => setCurrentLanguage('sin')}
                className={`px-2 py-1 rounded transition-colors ${currentLanguage === 'sin' ? 'bg-[#9A3412] text-white' : 'text-stone-600 hover:text-stone-950'}`}
              >
                SIN
              </button>
              <button 
                onClick={() => setCurrentLanguage('tam')}
                className={`px-2 py-1 rounded transition-colors ${currentLanguage === 'tam' ? 'bg-[#9A3412] text-white' : 'text-stone-600 hover:text-stone-950'}`}
              >
                TAM
              </button>
              <button 
                onClick={() => setCurrentLanguage('ar')}
                className={`px-2 py-1 rounded transition-colors ${currentLanguage === 'ar' ? 'bg-[#9A3412] text-white' : 'text-stone-600 hover:text-stone-950'}`}
              >
                AR (Saudi)
              </button>
            </div>

            {/* Session CTA Control */}
            <div className="hidden md:flex items-center gap-2">
              {session ? (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setActiveTab('dashboard')} 
                    className="flex items-center gap-1 text-xs font-semibold text-stone-700 hover:text-stone-950 bg-stone-100 hover:bg-stone-200/80 px-2.5 py-1.5 rounded-lg transition-colors border border-stone-200"
                  >
                    <User size={13} className="text-[#9A3412]" />
                    <span className="max-w-[70px] truncate">{session.fullName.split(' ')[0]}</span>
                  </button>
                  <button 
                    onClick={handleLogout} 
                    className="text-xs text-stone-400 hover:text-stone-700 transition-colors font-medium px-1"
                  >
                    {tNav('logout')}
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setActiveTab('login')} 
                  className="text-xs font-semibold text-white bg-[#9A3412] hover:bg-[#78350F] px-3.5 py-1.5 rounded-lg transition-colors shadow-2xs"
                >
                  {tNav('signIn')}
                </button>
              )}
            </div>

            {/* Mobile Menu Trigger */}
            <button 
              className="md:hidden text-stone-700 hover:text-stone-950 p-1"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Panel */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#FAF9F6] border-b border-stone-200 py-4 px-4 flex flex-col gap-4">
            <button 
              onClick={() => { setSelectedPetitionSlug('save-anojan'); setActiveTab('home'); setMobileMenuOpen(false); }} 
              className="text-left py-2 text-stone-700 hover:text-stone-950 font-medium border-b border-stone-100"
            >
              {tNav('flagshipTab')}
            </button>
            <button 
              onClick={() => { setActiveTab('explore'); setMobileMenuOpen(false); }} 
              className="text-left py-2 text-stone-700 hover:text-stone-950 font-medium border-b border-stone-100"
            >
              {tNav('exploreTab')}
            </button>
            <button 
              onClick={() => { setActiveTab('ledger'); setMobileMenuOpen(false); }} 
              className="text-left py-2 text-stone-700 hover:text-stone-950 font-medium border-b border-stone-100"
            >
              {tNav('ledgerTab')}
            </button>
            {session?.role === 'admin' && (
              <button 
                onClick={() => { 
                  setMobileMenuOpen(false);
                  setActiveTab('start');
                }} 
                className="text-left py-2 text-stone-700 hover:text-stone-950 font-medium border-b border-stone-100"
              >
                {tNav('startTab')}
              </button>
            )}
            
            <div className="pt-2">
              {session ? (
                <div className="flex flex-col gap-3">
                  <span className="text-xs text-stone-500">{session.fullName}</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
                      className="flex-1 text-center py-2 text-xs font-semibold text-stone-700 bg-stone-100 border border-stone-200 rounded-lg"
                    >
                      {tNav('dashboard')}
                    </button>
                    <button 
                      onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                      className="flex-1 text-center py-2 text-xs text-stone-500 bg-stone-100 rounded-lg"
                    >
                      {tNav('logout')}
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => { setActiveTab('login'); setMobileMenuOpen(false); }} 
                  className="w-full text-center py-2.5 text-xs font-semibold text-white bg-[#9A3412] hover:bg-[#78350F] rounded-lg"
                >
                  {tNav('signIn')}
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Success Toast / Automated Password Dialog */}
        {successToast && successToast.show && (
          <div className="mb-8 bg-amber-50 border border-amber-200 rounded-xl p-5 shadow-xs relative">
            <button 
              onClick={() => setSuccessToast(null)} 
              className={`absolute top-3 ${currentLanguage === 'ar' ? 'left-3' : 'right-3'} text-stone-400 hover:text-stone-600`}
            >
              <X size={18} />
            </button>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-[#9A3412]/10 text-[#9A3412] rounded-lg shrink-0">
                <Check size={20} />
              </div>
              <div className="flex-1">
                <h4 className="text-base font-semibold text-[#78350F]">
                  {currentLanguage === 'ar' ? 'تمت العملية بنجاح!' : 'Action Completed Successfully!'}
                </h4>
                <p className="text-sm text-stone-700 mt-1">{successToast.message}</p>
                
                {successToast.autoPass && (
                  <div className="mt-4 p-4 bg-white border border-amber-100 rounded-lg max-w-md">
                    <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                      {t('autoAccountCreated')}
                    </p>
                    <p className="text-xs text-stone-600 mt-1">
                      {t('autoAccountNote')}
                    </p>
                    <div className="mt-2 flex items-center justify-between text-sm font-mono bg-stone-50 p-2.5 rounded border border-stone-200">
                      <div>
                        <div className="text-stone-600">
                          <span className="font-semibold text-stone-900">User:</span> {phone}
                        </div>
                        <div className="text-stone-600 mt-1">
                          <span className="font-semibold text-stone-900">Pass:</span> <span className="bg-[#9A3412]/10 px-1.5 py-0.5 rounded text-[#9A3412] font-semibold">{successToast.autoPass}</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-stone-400 border border-stone-200 bg-white px-1.5 py-0.5 rounded tracking-wide font-sans">
                        AUTOMATED
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-2">
                      {t('keepPasswordSafe')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- Tab Views --- */}

        {/* VIEW 1: Home Flagship Petition */}
        {activeTab === 'home' && (
          <div className="space-y-12">
            
            {/* Spectacular Platform Showcase Landing Hero (Exposes the Platform's strength) */}
            <div className="relative bg-gradient-to-br from-stone-900 via-stone-950 to-[#2D1207] text-white rounded-3xl p-8 sm:p-14 overflow-hidden border border-stone-800 shadow-xl">
              {/* Background elegant pattern */}
              <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,#FAF9F6_1px,transparent_1px),linear-gradient(to_bottom,#FAF9F6_1px,transparent_1px)] [background-size:24px_24px]"></div>
              <div className="absolute -right-24 -top-24 w-80 h-80 bg-[#9A3412]/20 rounded-full blur-3xl"></div>
              <div className="absolute -left-24 -bottom-24 w-80 h-80 bg-emerald-950/20 rounded-full blur-3xl"></div>
              
              <div className="relative z-10 max-w-4xl space-y-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-full">
                  🇱🇰 CHANGELK DIRECT CITIZEN PORTAL
                </span>
                
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight leading-tight">
                  {currentLanguage === 'en' ? (
                    <>Democracy in the hands of the <span className="text-amber-500 underline decoration-amber-600 underline-offset-4 decoration-2">Sovereign Citizens</span>.</>
                  ) : t('heroTitle')}
                </h1>
                
                <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-2xl font-medium">
                  {t('heroDesc')}
                </p>
                
                {/* Core Pillars / Features Showcase */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-stone-800/85">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 bg-[#9A3412]/20 text-amber-500 rounded-lg">
                        <FileText size={16} />
                      </span>
                      <h4 className="text-xs font-black uppercase tracking-wider text-stone-100">{t('heroPillar1Title')}</h4>
                    </div>
                    <p className="text-[11px] text-stone-400">{t('heroPillar1Desc')}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
                        <Globe size={16} />
                      </span>
                      <h4 className="text-xs font-black uppercase tracking-wider text-stone-100">{t('heroPillar2Title')}</h4>
                    </div>
                    <p className="text-[11px] text-stone-400">{t('heroPillar2Desc')}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 bg-sky-500/10 text-sky-400 rounded-lg">
                        <PenTool size={16} />
                      </span>
                      <h4 className="text-xs font-black uppercase tracking-wider text-stone-100">{t('heroPillar3Title')}</h4>
                    </div>
                    <p className="text-[11px] text-stone-400">{t('heroPillar3Desc')}</p>
                  </div>
                </div>

                {/* Quick Navigation Buttons to Showcase Tabs */}
                <div className="flex flex-wrap items-center gap-3 pt-4">
                  <button 
                    onClick={() => setActiveTab('explore')}
                    className="px-5 py-3 bg-[#9A3412] hover:bg-[#78350F] text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-md transition-all duration-300 hover:scale-[1.02]"
                  >
                    {t('heroBtnExplore')}
                  </button>
                  <button 
                    onClick={() => setActiveTab('polls')}
                    className="px-5 py-3 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-black uppercase tracking-widest rounded-xl border border-stone-700 transition-all duration-300 hover:scale-[1.02]"
                  >
                    {t('heroBtnVote')}
                  </button>
                  <button 
                    onClick={() => setActiveTab('ledger')}
                    className="px-5 py-3 bg-transparent hover:bg-stone-900 text-stone-300 text-xs font-black uppercase tracking-widest rounded-xl border border-stone-800 transition-all duration-300"
                  >
                    {t('heroBtnLedger')}
                  </button>
                </div>
              </div>
            </div>

            <div>
            {loading ? (
              <div className="py-24 text-center">
                <div className="animate-spin inline-block w-8 h-8 border-4 border-[#9A3412] border-t-transparent rounded-full" role="status"></div>
                <p className="text-xs text-stone-500 mt-4 uppercase tracking-widest font-semibold">{t('loading')}</p>
              </div>
            ) : selectedPetition ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                {/* Left Side: Campaign Advocacy (70% weight equivalent for editorial column) */}
                <div className="lg:col-span-8 flex flex-col">
                  
                  {/* Campaign Category / Date Ribbon (Metadata with Zero-Pill unboxed style) */}
                  <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest font-sans text-stone-500 font-semibold mb-3">
                    <span>{t('pardonAppeal')}</span>
                    <span aria-hidden="true" className="text-stone-300">·</span>
                    <span>{t('campaignActive')}</span>
                    <span aria-hidden="true" className="text-stone-300">·</span>
                    <span>CHANGELK SOVEREIGN CASE</span>
                  </div>

                  {/* Flagship Save Anojan Special Recreated Header or Default Header */}
                  {selectedPetition.slug === 'save-anojan' ? (
                    <div className="bg-gradient-to-br from-white via-[#F4F6F9] to-[#E9EFF6] border border-stone-200 rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden min-h-[460px] flex flex-col justify-between mt-4">
                      {/* Grid Split */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
                        {/* Text Content Column */}
                        <div className="md:col-span-7 flex flex-col">
                          
                          {/* Humanitarian Appeal Badge */}
                          <div className="self-start inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-[#78350F] bg-[#E6C687]/25 border border-[#E6C687]/40 px-3.5 py-1 rounded-full mb-4">
                            <Award size={12} className="text-[#9A3412]" />
                            {t('pardonAppeal')}
                          </div>
                          
                           {/* Large Title */}
                          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black text-[#112543] leading-none tracking-tight">
                            {t('anojanHeaderTitle')}
                          </h1>
                          
                          {/* Secondary Heading */}
                          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1F3E68] mt-3 leading-tight max-w-lg">
                            {t('anojanHeaderSub')}
                          </h2>
                          
                          {/* Standard description intro snippet */}
                          <p className="text-stone-600 text-xs sm:text-sm mt-3 leading-relaxed max-w-md font-medium">
                            {t('anojanHeaderDesc')}
                          </p>

                          {/* Recreated CTA Action Row */}
                          <div className="flex flex-wrap gap-3 mt-6">
                            <button 
                              onClick={() => {
                                const target = document.querySelector('.prose-stone');
                                  if (target) target.scrollIntoView({ behavior: 'smooth' });
                              }}
                              className="bg-[#0B2545] hover:bg-[#134074] text-white rounded-full px-5 py-3 text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-md transition-all whitespace-nowrap"
                            >
                              <FileText size={14} />
                              {t('readAppealBtn')}
                            </button>
                            
                            <button 
                              onClick={() => {
                                if (navigator.share) {
                                  navigator.share({
                                    title: t('anojanHeaderTitle'),
                                    text: t('anojanHeaderSub'),
                                    url: window.location.href,
                                  }).catch(console.error);
                                } else {
                                  navigator.clipboard.writeText(window.location.href);
                                  alert('Campaign URL copied to clipboard!');
                                }
                              }}
                              className="bg-white hover:bg-stone-50 border border-[#0B2545]/20 text-[#0B2545] rounded-full px-5 py-3 text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all whitespace-nowrap shadow-xs"
                            >
                              <Plus size={14} />
                              {t('shareAppealBtn')}
                            </button>
                          </div>

                          {/* Bold Orange Handwriting Styled text "Signature for Anojan" */}
                          <div className="mt-8 select-none">
                            <span className="text-3xl sm:text-4xl font-serif font-black italic text-[#FF3B00] tracking-wide leading-none drop-shadow-[0_2px_4px_rgba(253,224,71,0.95)]">
                              {t('anojanSignLabel')}
                            </span>
                          </div>

                        </div>

                        {/* Visual Image / Frame Column */}
                        <div className="md:col-span-5 relative flex items-center justify-center min-h-[300px]">
                          {/* Saudi Flag swoosh */}
                          <div className="absolute top-0 right-0 w-44 h-44 opacity-25 pointer-events-none transform rotate-12 scale-110">
                            <SaudiFlagSVG />
                          </div>

                          {/* Sri Lankan Flag swoosh */}
                          <div className="absolute bottom-0 left-0 w-40 h-40 opacity-30 pointer-events-none transform -rotate-12 scale-110">
                            <SriLankanFlagSVG />
                          </div>

                          {/* Mother frame */}
                          <div className="relative z-10 w-[200px] sm:w-[220px] aspect-[3/4] rounded-2xl border-[5px] border-[#E2B35B] shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-transform">
                            <MotherGraphicSVG />
                            {/* Mother Frame Label */}
                            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-stone-950/80 to-transparent p-2 text-center">
                              <span className="text-[10px] font-bold text-white uppercase tracking-wider">{t('motherLabel')}</span>
                            </div>
                          </div>

                          {/* Anojan frame (overlapping) */}
                          <div className="absolute z-20 bottom-0 right-4 sm:right-6 w-[110px] sm:w-[130px] aspect-[3/4] rounded-xl border-[4px] border-white shadow-2xl overflow-hidden transform hover:scale-[1.05] transition-transform">
                            <AnojanGraphicSVG />
                            {/* Anojan Label */}
                            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-stone-950/80 to-transparent p-1.5 text-center">
                              <span className="text-[9px] font-bold text-white uppercase tracking-wider">{t('anojanLabel')}</span>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  ) : (
                    <div>
                      {/* Default Campaign Banner for other petitions */}
                      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-950 leading-tight tracking-tight text-wrap">
                        {getPetitionContent(selectedPetition.slug, selectedPetition.title, selectedPetition.description).title}
                      </h1>
                      <div className="mt-6 aspect-16/9 bg-stone-100 rounded-2xl relative overflow-hidden shadow-md border border-stone-200/60 flex flex-col justify-end">
                        {selectedPetition.imageUrl ? (
                          <>
                            <img src={selectedPetition.imageUrl} alt="Campaign banner" className="absolute inset-0 w-full h-full object-contain sm:object-cover bg-stone-50" />
                            {/* Extremely light black layer so user picture shows 100% perfectly */}
                            <div className="absolute inset-0 bg-black/[0.04] hover:bg-transparent transition-colors duration-300"></div>
                          </>
                        ) : (
                          <>
                            <div className="absolute inset-0 flex items-center justify-center opacity-10 bg-stone-900">
                              <ScaleSVG />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-tr from-stone-950 via-stone-900/80 to-transparent"></div>
                            <div className="relative z-10 p-8 sm:p-12 max-w-xl">
                              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#FAF9F6]/80 bg-[#9A3412]/90 px-3 py-1 rounded-sm mb-4">
                                <Award size={12} /> {t('pardonAppeal')}
                              </div>
                              <h3 className="text-xl sm:text-2xl font-serif font-medium text-white tracking-wide">
                                {selectedPetition.title}
                              </h3>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Operational trust indicator bar */}
                  <div className="mt-4 flex flex-wrap items-center gap-y-2 gap-x-6 py-2.5 px-4 bg-stone-100 border border-stone-200 rounded-lg text-xs text-stone-600 font-medium">
                    <span>Goal: <strong className="text-stone-900">{formatNumber(selectedPetition.targetCount)}</strong></span>
                    <span className="hidden sm:inline" aria-hidden="true">·</span>
                    <span><strong className="text-[#9A3412] font-semibold">{t('urgencyHigh')}</strong></span>
                  </div>

                  {/* Administrative Campaign Controls */}
                  {session?.role === 'admin' && (
                    <div className="mt-4 p-5 bg-amber-50/60 border border-amber-200/80 rounded-2xl shadow-xs">
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <span className="text-xs font-black text-[#78350F] flex items-center gap-1.5 uppercase tracking-wider font-sans">
                          <span className="w-2 h-2 rounded-full bg-[#9A3412] animate-pulse"></span>
                          ADMINISTRATIVE CAMPAIGN CONTROLS
                        </span>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => {
                              setIsEditingCampaign(!isEditingCampaign);
                              setEditCampaignTitle(selectedPetition.title);
                              setEditCampaignDescription(selectedPetition.description);
                              setEditCampaignTargetCount(selectedPetition.targetCount.toString());
                              setEditCampaignImageUrl(selectedPetition.imageUrl || '');
                              setEditCampaignError('');
                            }}
                            className="text-xs font-bold px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors shadow-2xs uppercase tracking-wider"
                          >
                            {isEditingCampaign ? 'Cancel Edit' : 'Edit Campaign'}
                          </button>
                          <button 
                            onClick={handleDeleteCampaign}
                            className="text-xs font-bold px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-2xs uppercase tracking-wider"
                          >
                            Delete Campaign
                          </button>
                        </div>
                      </div>

                      {isEditingCampaign && (
                        <form onSubmit={handleEditCampaignSubmit} className="mt-5 pt-5 border-t border-amber-200/60 space-y-4">
                          <div>
                            <label className="block text-[10px] font-black text-stone-700 uppercase tracking-widest mb-1 font-sans">Campaign Title</label>
                            <input 
                              type="text" 
                              value={editCampaignTitle} 
                              onChange={(e) => setEditCampaignTitle(e.target.value)}
                              className="w-full text-sm bg-white border border-stone-300 rounded-lg p-2.5 focus:outline-hidden font-medium text-stone-900"
                              required
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-black text-stone-700 uppercase tracking-widest mb-1 font-sans">Goal Target Count</label>
                              <input 
                                type="number" 
                                value={editCampaignTargetCount} 
                                onChange={(e) => setEditCampaignTargetCount(e.target.value)}
                                className="w-full text-sm bg-white border border-stone-300 rounded-lg p-2.5 focus:outline-hidden font-medium text-stone-900"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-black text-stone-700 uppercase tracking-widest mb-1 font-sans">Banner Image URL</label>
                              <input 
                                type="url" 
                                value={editCampaignImageUrl} 
                                onChange={(e) => setEditCampaignImageUrl(e.target.value)}
                                className="w-full text-sm bg-white border border-stone-300 rounded-lg p-2.5 focus:outline-hidden font-medium text-stone-900"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-stone-700 uppercase tracking-widest mb-1 font-sans">Or Upload Fresh Image File</label>
                            <input 
                              type="file" 
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    setEditCampaignImageBase64(reader.result as string);
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                              className="w-full text-xs text-stone-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-amber-100 file:text-[#9A3412] hover:file:bg-amber-200 cursor-pointer"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-stone-700 uppercase tracking-widest mb-1 font-sans">Full Campaign Description (supports multiple paragraphs)</label>
                            <textarea 
                              rows={8}
                              value={editCampaignDescription} 
                              onChange={(e) => setEditCampaignDescription(e.target.value)}
                              className="w-full text-sm bg-white border border-stone-300 rounded-lg p-2.5 focus:outline-hidden font-medium text-stone-900 leading-relaxed"
                              required
                            />
                          </div>
                          {editCampaignError && <p className="text-xs text-red-600 font-bold">{editCampaignError}</p>}
                          <button 
                            type="submit"
                            className="px-5 py-2.5 bg-[#9A3412] hover:bg-[#78350F] text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-md"
                          >
                            Save Changes
                          </button>
                        </form>
                      )}
                    </div>
                  )}

                  {/* Main Editorial Case Narrative (Comfortable reading measure) */}
                  <div className="mt-8 prose prose-stone max-w-none text-stone-800 leading-relaxed text-base sm:text-lg">
                    {getPetitionContent(selectedPetition.slug, selectedPetition.title, selectedPetition.description).description.split('\n\n').map((paragraph, idx) => {
                      if (paragraph.startsWith('**') || paragraph.startsWith('1.') || paragraph.startsWith('١.')) {
                        // Special styling for highlights and requirements
                        return (
                          <div key={idx} className="my-6 p-5 bg-stone-50 border-l-2 border-[#9A3412] rounded-r-lg font-sans text-sm text-stone-700">
                            {paragraph.split('\n').map((line, lIdx) => (
                              <p key={lIdx} className={lIdx > 0 ? 'mt-2' : ''}>{line.replace(/\*\*/g, '')}</p>
                            ))}
                          </div>
                        );
                      }
                      return (
                        <p key={idx} className="mb-6 font-serif-editorial leading-relaxed whitespace-pre-line text-stone-900/95">
                          {idx === 0 ? (
                            // Drop-cap for the opening paragraph
                            <span className="first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-[#9A3412]">
                              {paragraph}
                            </span>
                          ) : paragraph}
                        </p>
                      );
                    })}
                  </div>

                  {/* Public Ledger / Recent signers preview in campaign view */}
                  <div className="mt-12 border-t border-stone-200 pt-8">
                    <h3 className="text-xl font-serif font-bold text-stone-950 mb-4">
                      {t('recentSignatures')}
                    </h3>
                    
                    <div className="space-y-4">
                      {(selectedPetition.signatures && selectedPetition.signatures.length > 0) ? (
                        selectedPetition.signatures.slice(0, 3).map((sig) => (
                          <div key={sig.id} className="flex items-start gap-4 p-4 bg-white border border-stone-200 rounded-xl shadow-2xs">
                            <img 
                              src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(sig.fullName)}`}
                              alt={sig.fullName} 
                              className="w-12 h-12 rounded-lg border border-stone-100 object-cover bg-stone-50"
                              referrerPolicy="no-referrer"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-baseline justify-between gap-x-2">
                                <h5 className="text-xs font-semibold text-stone-900">
                                  {sig.fullName} <span className="font-normal text-stone-400">({sig.district})</span>
                                </h5>
                                <span className="text-[10px] text-stone-400 font-medium">
                                  {new Date(sig.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              {sig.comment && (
                                <p className="text-xs font-serif italic text-stone-600 mt-1 leading-relaxed bg-stone-50 p-2 rounded">
                                  "{sig.comment}"
                                </p>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-stone-500 italic">{t('noSignatures')}</p>
                      )}
                    </div>
                    
                    <button 
                      onClick={() => setActiveTab('ledger')}
                      className="mt-4 text-xs font-semibold text-[#9A3412] hover:text-[#78350F] flex items-center gap-1 hover:underline transition-all"
                    >
                      {t('viewAllLedger')} <ChevronRight size={14} />
                    </button>
                  </div>

                </div>

                {/* Right Side: Dynamic Progress and Signature Card (30% equivalent) */}
                <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
                  <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
                    
                    {/* Live Progress Bar indicator */}
                    <div>
                      <div className="flex justify-between items-baseline gap-2">
                        <span className="text-2xl font-mono tracking-tight font-bold text-stone-950">
                          {formatNumber(selectedPetition.currentCount)}
                        </span>
                        <span className="text-xs font-medium text-stone-500">
                          {t('targetLabel')} {formatNumber(selectedPetition.targetCount)}
                        </span>
                      </div>
                      <div className="mt-2 w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-[#9A3412] h-2 rounded-full transition-all duration-500" 
                          style={{ width: `${Math.min(100, (selectedPetition.currentCount / selectedPetition.targetCount) * 100)}%` }}
                        ></div>
                      </div>
                      <div className="mt-2 text-[11px] text-stone-500 flex justify-between gap-2">
                        <span>{((selectedPetition.currentCount / selectedPetition.targetCount) * 100).toFixed(1)}% {t('completed')}</span>
                        <span className="font-semibold text-[#9A3412]">{t('peoplesVoice')}</span>
                      </div>
                    </div>

                    {/* Signature Form */}
                    <div className="mt-6 border-t border-stone-100 pt-6">
                      <h4 className="text-base font-serif font-bold text-stone-950 mb-4 flex items-center gap-1.5">
                        <PenTool size={16} className="text-[#9A3412]" />
                        {t('signPetitionTitle')}
                      </h4>

                      <form onSubmit={handleSignPetition} className="space-y-4">
                        
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                            {t('fullNameLabel')}
                          </label>
                          <input 
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Saman Kumara"
                            className="w-full text-sm bg-[#FAF9F6] border border-stone-300 rounded-lg px-3.5 py-2 focus:outline-hidden focus:border-[#9A3412] text-stone-900 placeholder-stone-400 font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                            {t('phoneLabel')}
                          </label>
                          <input 
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+94771234567"
                            className="w-full text-sm bg-[#FAF9F6] border border-stone-300 rounded-lg px-3.5 py-2 focus:outline-hidden focus:border-[#9A3412] text-stone-900 placeholder-stone-400 font-medium"
                          />
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                              {t('districtLabel')}
                            </label>
                            <select 
                              value={district}
                              onChange={(e) => setDistrict(e.target.value)}
                              className="w-full text-sm bg-[#FAF9F6] border border-stone-300 rounded-lg px-3 py-2 focus:outline-hidden focus:border-[#9A3412] text-stone-900 font-medium"
                            >
                              {districts.map(d => (
                                <option key={d} value={d}>{d}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                            {t('commentLabel')}
                          </label>
                          <textarea 
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={2}
                            placeholder="I stand for mercy..."
                            className="w-full text-sm bg-[#FAF9F6] border border-stone-300 rounded-lg px-3.5 py-2 focus:outline-hidden focus:border-[#9A3412] text-stone-900 placeholder-stone-400 font-medium resize-none"
                          />
                        </div>

                        {/* Signature Canvas Pad */}
                        <div>
                          <div className="flex justify-between items-center mb-1 gap-2">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
                              {t('drawSignatureLabel')}
                            </label>
                            <button 
                              type="button" 
                              onClick={clearCanvas}
                              className="text-[10px] font-semibold text-[#9A3412] hover:underline"
                            >
                              {t('clearSignature')}
                            </button>
                          </div>
                          
                          <div className="border border-stone-300 rounded-lg bg-[#FAF9F6] overflow-hidden cursor-crosshair">
                            <canvas 
                              ref={canvasRef}
                              width={320}
                              height={110}
                              onMouseDown={startDrawing}
                              onMouseMove={draw}
                              onMouseUp={stopDrawing}
                              onMouseLeave={stopDrawing}
                              onTouchStart={startDrawing}
                              onTouchMove={draw}
                              onTouchEnd={stopDrawing}
                              className="w-full h-[110px] block bg-white"
                            />
                          </div>
                          <p className="text-[9px] text-stone-400 mt-1 leading-relaxed">
                            {t('canvasHelp')}
                          </p>
                        </div>

                        <button 
                          type="submit"
                          disabled={submittingSignature}
                          className="w-full text-sm font-semibold text-white bg-[#9A3412] hover:bg-[#78350F] disabled:bg-stone-400 py-3 rounded-lg transition-colors border border-transparent shadow-xs text-center"
                        >
                          {submittingSignature ? t('signingButtonActive') : t('signingButton')}
                        </button>

                      </form>
                    </div>

                  </div>
                </div>

              </div>
            ) : (
              <div className="bg-stone-50 border border-stone-200 rounded-3xl p-8 sm:p-12 text-center max-w-3xl mx-auto">
                <div className="w-16 h-16 bg-stone-100 border border-stone-200 text-stone-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText size={28} />
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-black text-stone-950">
                  Awaiting Sovereign Initiatives
                </h3>
                <p className="text-stone-600 text-xs sm:text-sm mt-3 leading-relaxed max-w-lg mx-auto font-medium">
                  The Sovereign Audit Ledger is prepared and awaiting the launch of official citizen interest and humanitarian campaigns. Explore our direct voting polls or audit logs in the navigation links.
                </p>
              </div>
            )}

            {/* Active Citizen Campaigns Section right on Homepage with Circular Progress Rings */}
            <div className="mt-16 border-t border-stone-200 pt-12">
              <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 mb-8">
                <div>
                  <span className="text-xs uppercase tracking-widest font-sans font-semibold text-stone-500">Grassroots Movements</span>
                  <h3 className="text-2xl font-serif font-bold text-stone-950 mt-1">
                    Active Sovereign Campaigns
                  </h3>
                </div>
                <button 
                  onClick={() => setActiveTab('explore')}
                  className="text-xs font-semibold text-[#9A3412] hover:text-[#78350F] flex items-center gap-1 hover:underline self-start"
                >
                  View All Initiatives <ChevronRight size={14} />
                </button>
              </div>

              {/* Grid with Circular Progress Indicators */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {petitions.map((p) => {
                  const percentage = Math.min(100, (p.currentCount / p.targetCount) * 100);
                  const isSelected = p.slug === selectedPetitionSlug;
                  const localized = getPetitionContent(p.slug, p.title, p.description);

                  return (
                    <div 
                      key={p.id}
                      onClick={() => {
                        setSelectedPetitionSlug(p.slug);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`bg-white border rounded-2xl p-5 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all ${isSelected ? 'border-[#9A3412] ring-2 ring-[#9A3412]/10 bg-[#9A3412]/5' : 'border-stone-200 hover:border-stone-300'}`}
                    >
                      {/* Circle Progress SVG */}
                      <div className="relative shrink-0 flex items-center justify-center w-16 h-16">
                        <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                          <path 
                            className="text-stone-100" 
                            strokeWidth="3.5" 
                            stroke="currentColor" 
                            fill="none" 
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                          />
                          <path 
                            className="text-[#9A3412]" 
                            strokeDasharray={`${percentage}, 100`} 
                            strokeWidth="3.5" 
                            strokeLinecap="round" 
                            stroke="currentColor" 
                            fill="none" 
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                          />
                        </svg>
                        <span className="absolute text-[11px] font-mono font-bold text-stone-800">
                          {percentage.toFixed(0)}%
                        </span>
                      </div>

                      {/* Text Column */}
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-serif font-bold text-stone-900 truncate leading-snug">
                          {localized.title}
                        </h4>
                        <p className="text-[11px] text-stone-500 mt-1 flex items-center justify-between gap-2">
                          <span>{formatNumber(p.currentCount)} signed</span>
                          <span>Goal: {formatNumber(p.targetCount)}</span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dynamic Victory / Change-makers Showcase Section (As Requested by User Image) */}
            {(() => {
              const activeSpotlights: any[] = [];
              
              // 1. Add real petitions
              petitions.forEach(p => {
                const localized = getPetitionContent(p.slug, p.title, p.description);
                activeSpotlights.push({
                  id: p.id,
                  type: 'petition',
                  title: localized.title,
                  image: p.imageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(p.title)}`,
                  status: p.status === 'active' ? 'Live updates signatures' : 'Completed Appeal',
                  countText: `${formatNumber(p.currentCount)} signatures`,
                  onClick: () => {
                    setSelectedPetitionSlug(p.slug);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                });
              });

              // 2. Add real polls
              polls.forEach(poll => {
                activeSpotlights.push({
                  id: poll.id,
                  type: 'poll',
                  title: poll.title,
                  image: poll.imageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(poll.title)}&backgroundColor=0f172a,334155,475569`,
                  status: poll.status === 'active' ? 'Live updates signatures' : 'Closed',
                  countText: `${formatNumber(poll.votesCount || 0)} votes`,
                  onClick: () => {
                    setSelectedPollId(poll.id);
                    setActiveTab('polls');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                });
              });

              // 3. Fallback to default mock spotlight data if database has no records
              if (activeSpotlights.length === 0) {
                activeSpotlights.push(
                  {
                    id: 'mock-1',
                    title: 'Ban toxic industrial dumping in waterways',
                    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300&h=300',
                    status: 'Live updates signatures',
                    countText: '770,243 signatures',
                  },
                  {
                    id: 'mock-2',
                    title: 'Compulsory pediatric clinics in rural zones',
                    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300&h=300',
                    status: 'Live updates signatures',
                    countText: '100,353 signatures',
                  },
                  {
                    id: 'mock-3',
                    title: 'Declare sanctuary zone around Wilpattu',
                    image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=300&h=300',
                    status: 'Live updates signatures',
                    countText: '97,270 signatures',
                  },
                  {
                    id: 'mock-4',
                    title: 'Implement strict penalty for animal cruelty',
                    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=300&h=300',
                    status: 'Live updates signatures',
                    countText: '46,991 signatures',
                  },
                  {
                    id: 'mock-5',
                    title: 'Establish youth digital hubs in East',
                    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300',
                    status: 'Live updates signatures',
                    countText: '610,790 signatures',
                  }
                );
              }

              // Compute aggregate stats for the real-time live counter boxes
              const totalSignatures = 1625647 + petitions.reduce((acc, p) => acc + p.currentCount, 0);
              const totalVotes = 842912 + polls.reduce((acc, p) => acc + (p.votesCount || 0), 0);

              return (
                <div className="mt-16 pt-12 border-t border-stone-200">
                  <div className="bg-gradient-to-r from-sky-50/40 via-white to-amber-50/30 border border-stone-200/60 rounded-3xl p-8 sm:p-12 shadow-2xs">
                    
                    <h3 className="text-xl sm:text-2xl font-serif font-black text-stone-900 text-center tracking-tight mb-2">
                      Currently running polls and petitions
                    </h3>
                    <p className="text-stone-500 text-xs text-center tracking-normal mb-10 max-w-lg mx-auto leading-relaxed">
                      Dynamic, live updates of public opinion polls and sovereign petitions currently active across Sri Lanka. Click any item below to view and participate.
                    </p>

                    {/* TWO-TWO BOXES: Beautiful Live Real-Time Counter Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12">
                      {/* Box 1: Live Signatures Counter */}
                      <div className="bg-[#FAF9F6] border border-stone-200 shadow-sm rounded-2xl p-6 relative overflow-hidden group hover:border-[#9A3412] hover:shadow-md transition-all duration-300">
                        <div className="absolute top-4 right-4 flex h-3 w-3 items-center justify-center">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#9A3412]"></span>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Live Updates Signatures</span>
                        <div className="text-3xl sm:text-4xl font-sans font-black text-stone-900 mt-2 tracking-tight">
                          {formatNumber(totalSignatures)}
                        </div>
                        <p className="text-[11px] font-medium text-stone-500 mt-1">
                          Verified, unalterable citizen signatures logged chronologically on-ledger.
                        </p>
                      </div>

                      {/* Box 2: Live Votes Counter */}
                      <div className="bg-[#FAF9F6] border border-stone-200 shadow-sm rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-600 hover:shadow-md transition-all duration-300">
                        <div className="absolute top-4 right-4 flex h-3 w-3 items-center justify-center">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Live updates opinions</span>
                        <div className="text-3xl sm:text-4xl font-sans font-black text-stone-900 mt-2 tracking-tight">
                          {formatNumber(totalVotes)}
                        </div>
                        <p className="text-[11px] font-medium text-stone-500 mt-1">
                          Secure agree, disagree, and neutral opinions recorded transparently.
                        </p>
                      </div>
                    </div>

                    {/* Dynamic Changemakers Row Grid */}
                    <div className="flex flex-wrap gap-8 items-center justify-center">
                      {activeSpotlights.map((spot, idx) => (
                        <div 
                          key={spot.id || idx} 
                          onClick={spot.onClick}
                          className={`text-center flex flex-col items-center ${spot.onClick ? 'cursor-pointer group' : ''}`}
                        >
                          <div className="relative">
                            <div className="absolute inset-0 bg-stone-200 rounded-full scale-105 opacity-0 group-hover:opacity-100 transition-all duration-300 blur-xs"></div>
                            <img 
                              src={spot.image} 
                              alt={spot.title} 
                              className="relative z-10 w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-md object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                          {/* Floating Info Capsule */}
                          <div className="bg-white border border-stone-200/80 shadow-sm rounded-2xl py-2 px-4 text-center mt-3 relative z-20 min-w-[130px] sm:min-w-[150px] transition-transform duration-300 group-hover:scale-102">
                            <div className="text-[10px] sm:text-xs font-black text-stone-800 flex items-center justify-center gap-1.5 truncate max-w-[140px] mx-auto">
                              <span className={`w-1.5 h-1.5 rounded-full ${spot.status.includes('Completed') || spot.status.includes('Closed') ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`}></span>
                              {spot.status}
                            </div>
                            <div className="text-[9px] sm:text-[10px] text-stone-500 font-bold font-sans mt-0.5 whitespace-nowrap">
                              {spot.countText}
                            </div>
                          </div>
                          {/* Mini Title */}
                          <p className="text-[10px] text-stone-700 font-bold max-w-[130px] mt-2.5 leading-tight line-clamp-2 uppercase tracking-wider text-center group-hover:text-stone-950">
                            {spot.title}
                          </p>
                        </div>
                      ))}
                    </div>

                  </div>
                </div>
              );
            })()}

          </div>
          </div>
        )}

        {/* VIEW: Public Opinion Polls */}
        {activeTab === 'polls' && (
          <div className="max-w-6xl mx-auto space-y-12">
            
            {/* Majestic Hub Header Banner */}
            <div className="relative bg-gradient-to-br from-stone-900 to-stone-950 text-white rounded-3xl p-8 sm:p-12 overflow-hidden shadow-xl border border-stone-800">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FAF9F6_1px,transparent_1px)] [background-size:16px_16px]"></div>
              <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#9A3412]/15 rounded-full blur-3xl"></div>
              <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-emerald-950/20 rounded-full blur-3xl"></div>
              
              <div className="relative z-10 max-w-3xl">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-[#9A3412]/30 border border-[#9A3412]/50 text-[#FB923C] rounded-full mb-4">
                  <Globe size={11} className="animate-spin-slow" /> Direct Democracy Portal
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-stone-50">
                  {t('pollsHeading')}
                </h2>
                <p className="text-stone-300 text-sm sm:text-base mt-3 leading-relaxed max-w-2xl">
                  {t('pollsSubheading')} – Every consensus is verified by cryptographic citizen signatures and localized district logs.
                </p>
                
                <div className="flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-stone-800 text-xs text-stone-400">
                  <div>
                    <span className="text-stone-500 block uppercase font-mono tracking-wider text-[9px]">Sovereign Power</span>
                    <span className="text-stone-200 font-bold">100% Authoritative</span>
                  </div>
                  <div className="w-px h-8 bg-stone-800 hidden sm:block"></div>
                  <div>
                    <span className="text-stone-500 block uppercase font-mono tracking-wider text-[9px]">Audit Trail</span>
                    <span className="text-stone-200 font-bold">Public Ledger Verified</span>
                  </div>
                </div>
              </div>
            </div>

            {polls.length > 0 ? (
              <div className="space-y-12">
                {polls.map((poll) => {
                  const total = (poll.yesCount || 0) + (poll.noCount || 0) + (poll.neutralCount || 0) || 1;
                  const yesPct = ((poll.yesCount || 0) / total) * 100;
                  const noPct = ((poll.noCount || 0) / total) * 100;
                  const neutralPct = ((poll.neutralCount || 0) / total) * 100;

                  // Determine current leading consensus
                  let leadingLabel = 'Undecided / Tying';
                  let leadingColor = 'bg-stone-100 text-stone-700 border-stone-200';
                  if (poll.yesCount > poll.noCount && poll.yesCount > poll.neutralCount) {
                    leadingLabel = 'Sovereign Consensus: AGREE (இணக்கம்)';
                    leadingColor = 'bg-emerald-50 text-emerald-800 border-emerald-200 ring-2 ring-emerald-500/10';
                  } else if (poll.noCount > poll.yesCount && poll.noCount > poll.neutralCount) {
                    leadingLabel = 'Sovereign Consensus: DISAGREE (விலகல்)';
                    leadingColor = 'bg-red-50 text-red-800 border-red-200 ring-2 ring-red-500/10';
                  } else if (poll.neutralCount > poll.yesCount && poll.neutralCount > poll.noCount) {
                    leadingLabel = 'Sovereign Consensus: NEUTRAL (நடுநிலை)';
                    leadingColor = 'bg-stone-100 text-stone-800 border-stone-300 ring-2 ring-stone-500/10';
                  }

                  return (
                    <div key={poll.id} className="bg-white border border-stone-200/80 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300">
                      
                      {/* Top Accent Strip */}
                      <div className="h-2 bg-gradient-to-r from-emerald-600 via-[#9A3412] to-red-600"></div>
                      
                      <div className="p-6 sm:p-10">
                        {/* Split Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                          
                          {/* LEFT COLUMN: Question & Consensus Analytics (Spans 7) */}
                          <div className="lg:col-span-7 space-y-6">
                            <div>
                              <div className="flex flex-wrap items-center gap-2 mb-3">
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100/60 border border-emerald-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                                  Live Direct Vote
                                </span>
                                <span className="text-[10px] text-stone-400 font-mono">
                                  Reference ID: {poll.id.substring(0, 12)}...
                                </span>
                              </div>

                              {poll.imageUrl && (
                                <div className="mb-6 aspect-16/9 w-full bg-stone-100 rounded-2xl overflow-hidden shadow-md border border-stone-200/60 relative">
                                  <img 
                                    src={poll.imageUrl} 
                                    alt={poll.title} 
                                    className="absolute inset-0 w-full h-full object-contain sm:object-cover bg-stone-50"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div className="absolute inset-0 bg-black/[0.03] hover:bg-transparent transition-colors duration-300"></div>
                                </div>
                              )}

                              <h3 className="text-2xl sm:text-3xl font-serif font-black text-stone-950 leading-tight">
                                {poll.title}
                              </h3>
                              <p className="text-stone-600 text-sm sm:text-base mt-4 leading-relaxed font-sans">
                                {poll.description}
                              </p>

                              {/* Administrative Poll Controls */}
                              {session?.role === 'admin' && (
                                <div className="mt-4 p-4 bg-amber-50/60 border border-amber-200/80 rounded-xl">
                                  <div className="flex items-center justify-between flex-wrap gap-2">
                                    <span className="text-xs font-bold text-[#78350F] flex items-center gap-1.5 uppercase tracking-wider font-sans">
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#9A3412] animate-pulse"></span>
                                      POLL CONTROLS
                                    </span>
                                    <div className="flex gap-2">
                                      <button 
                                        onClick={() => {
                                          setIsEditingPoll(!isEditingPoll);
                                          setEditPollTitle(poll.title);
                                          setEditPollDescription(poll.description);
                                          setEditPollImageUrl(poll.imageUrl || '');
                                          setEditPollError('');
                                        }}
                                        className="text-[11px] font-bold px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-md transition-colors uppercase tracking-wider"
                                      >
                                        {isEditingPoll ? 'Cancel' : 'Edit Poll'}
                                      </button>
                                      <button 
                                        onClick={() => handleDeletePoll(poll.id)}
                                        className="text-[11px] font-bold px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors uppercase tracking-wider"
                                      >
                                        Delete Poll
                                      </button>
                                    </div>
                                  </div>

                                  {isEditingPoll && (
                                    <form onSubmit={(e) => handleEditPollSubmit(e, poll.id)} className="mt-3 pt-3 border-t border-amber-200/60 space-y-3">
                                      <div>
                                        <label className="block text-[9px] font-black text-stone-700 uppercase tracking-widest mb-1 font-sans">Poll Question</label>
                                        <input 
                                          type="text" 
                                          value={editPollTitle} 
                                          onChange={(e) => setEditPollTitle(e.target.value)}
                                          className="w-full text-xs bg-white border border-stone-300 rounded-md p-2 focus:outline-hidden font-medium text-stone-900"
                                          required
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-[9px] font-black text-stone-700 uppercase tracking-widest mb-1 font-sans">Banner Graphic URL</label>
                                        <input 
                                          type="url" 
                                          value={editPollImageUrl} 
                                          onChange={(e) => setEditPollImageUrl(e.target.value)}
                                          className="w-full text-xs bg-white border border-stone-300 rounded-md p-2 focus:outline-hidden font-medium text-stone-900"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-[9px] font-black text-stone-700 uppercase tracking-widest mb-1 font-sans">Context / Description</label>
                                        <textarea 
                                          rows={4}
                                          value={editPollDescription} 
                                          onChange={(e) => setEditPollDescription(e.target.value)}
                                          className="w-full text-xs bg-white border border-stone-300 rounded-md p-2 focus:outline-hidden font-medium text-stone-900 leading-relaxed"
                                          required
                                        />
                                      </div>
                                      {editPollError && <p className="text-[11px] text-red-600 font-bold">{editPollError}</p>}
                                      <button 
                                        type="submit"
                                        className="px-3 py-1.5 bg-[#9A3412] hover:bg-[#78350F] text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-all shadow-xs"
                                      >
                                        Save Changes
                                      </button>
                                    </form>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Leading consensus status display */}
                            <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${leadingColor} transition-all`}>
                              <div className="flex items-center gap-2">
                                <span className="text-lg">🎯</span>
                                <span className="text-xs font-bold uppercase tracking-wider">{leadingLabel}</span>
                              </div>
                              <span className="text-[10px] font-mono text-stone-400">Calculated Live</span>
                            </div>

                            {/* High-fidelity Statistics Dashboard */}
                            <div className="space-y-4 bg-stone-50 p-6 rounded-2xl border border-stone-200/60 shadow-inner">
                              <h4 className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-2 flex justify-between items-center">
                                <span>Direct Aggregate Ledger</span>
                                <span className="font-mono text-[10px] text-[#9A3412] bg-[#9A3412]/5 px-2 py-0.5 rounded">
                                  {poll.votesCount || 0} Registered Responses
                                </span>
                              </h4>
                              
                              {/* Option Meter - AGREE */}
                              <div className="bg-white p-4 rounded-xl border border-stone-200/80">
                                <div className="flex justify-between text-xs font-bold text-stone-800 mb-1.5">
                                  <span className="flex items-center gap-1.5 text-emerald-800">
                                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                                    {t('yesOption')}
                                  </span>
                                  <span className="font-mono">{yesPct.toFixed(1)}% <span className="text-stone-400 font-normal">({poll.yesCount || 0})</span></span>
                                </div>
                                <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden">
                                  <div className="bg-emerald-600 h-3 rounded-full transition-all duration-500" style={{ width: `${yesPct}%` }}></div>
                                </div>
                              </div>

                              {/* Option Meter - DISAGREE */}
                              <div className="bg-white p-4 rounded-xl border border-stone-200/80">
                                <div className="flex justify-between text-xs font-bold text-stone-800 mb-1.5">
                                  <span className="flex items-center gap-1.5 text-red-800">
                                    <span className="w-2 h-2 rounded-full bg-red-600"></span>
                                    {t('noOption')}
                                  </span>
                                  <span className="font-mono">{noPct.toFixed(1)}% <span className="text-stone-400 font-normal">({poll.noCount || 0})</span></span>
                                </div>
                                <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden">
                                  <div className="bg-red-600 h-3 rounded-full transition-all duration-500" style={{ width: `${noPct}%` }}></div>
                                </div>
                              </div>

                              {/* Option Meter - NEUTRAL */}
                              <div className="bg-white p-4 rounded-xl border border-stone-200/80">
                                <div className="flex justify-between text-xs font-bold text-stone-800 mb-1.5">
                                  <span className="flex items-center gap-1.5 text-stone-600">
                                    <span className="w-2 h-2 rounded-full bg-stone-400"></span>
                                    {t('neutralOption')}
                                  </span>
                                  <span className="font-mono">{neutralPct.toFixed(1)}% <span className="text-stone-400 font-normal">({poll.neutralCount || 0})</span></span>
                                </div>
                                <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden">
                                  <div className="bg-stone-500 h-3 rounded-full transition-all duration-500" style={{ width: `${neutralPct}%` }}></div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* RIGHT COLUMN: Highly Tactile Voting Form (Spans 5) */}
                          <div className="lg:col-span-5 bg-stone-50 p-6 sm:p-8 rounded-2xl border border-stone-200/80 shadow-xs">
                            <h4 className="text-base font-serif font-black text-stone-900 mb-4 flex items-center gap-2">
                              <PenTool size={18} className="text-[#9A3412]" />
                              Cast Your Direct Vote
                            </h4>

                            <form onSubmit={(e) => handleVotePoll(e, poll.id)} className="space-y-4">
                              {/* Stance Tactile Cards */}
                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-2">
                                  Select Your Sovereign Stance *
                                </label>
                                <div className="grid grid-cols-1 gap-2.5">
                                  
                                  {/* Yes / Agree Button */}
                                  <button
                                    type="button"
                                    onClick={() => setVoteOption('yes')}
                                    className={`p-3 text-left rounded-xl border-2 transition-all flex items-center justify-between gap-4 ${voteOption === 'yes' ? 'bg-emerald-50 border-emerald-600 text-emerald-950 ring-4 ring-emerald-600/10 shadow-xs' : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'}`}
                                  >
                                    <div>
                                      <span className="text-xs font-black block">Agree / இணக்கம் / ஆம்</span>
                                      <span className="text-[10px] text-stone-500 font-normal">I endorse this legislative proposal.</span>
                                    </div>
                                    <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${voteOption === 'yes' ? 'border-emerald-600 bg-emerald-600' : 'border-stone-300'}`}>
                                      {voteOption === 'yes' && <Check size={10} className="text-white" />}
                                    </span>
                                  </button>

                                  {/* No / Disagree Button */}
                                  <button
                                    type="button"
                                    onClick={() => setVoteOption('no')}
                                    className={`p-3 text-left rounded-xl border-2 transition-all flex items-center justify-between gap-4 ${voteOption === 'no' ? 'bg-red-50 border-red-600 text-red-950 ring-4 ring-red-600/10 shadow-xs' : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'}`}
                                  >
                                    <div>
                                      <span className="text-xs font-black block">Disagree / விலகல் / இல்லை</span>
                                      <span className="text-[10px] text-stone-500 font-normal">I oppose these guidelines directly.</span>
                                    </div>
                                    <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${voteOption === 'no' ? 'border-red-600 bg-red-600' : 'border-stone-300'}`}>
                                      {voteOption === 'no' && <Check size={10} className="text-white" />}
                                    </span>
                                  </button>

                                  {/* Neutral Button */}
                                  <button
                                    type="button"
                                    onClick={() => setVoteOption('neutral')}
                                    className={`p-3 text-left rounded-xl border-2 transition-all flex items-center justify-between gap-4 ${voteOption === 'neutral' ? 'bg-stone-100 border-stone-500 text-stone-950 ring-4 ring-stone-600/10 shadow-xs' : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'}`}
                                  >
                                    <div>
                                      <span className="text-xs font-black block">Neutral / நடுநிலை / சார்பற்ற</span>
                                      <span className="text-[10px] text-stone-500 font-normal">I stay impartial or request review.</span>
                                    </div>
                                    <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${voteOption === 'neutral' ? 'border-stone-500 bg-stone-500' : 'border-stone-300'}`}>
                                      {voteOption === 'neutral' && <Check size={10} className="text-white" />}
                                    </span>
                                  </button>
                                </div>
                              </div>

                              {/* Form Fields Grid */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <div>
                                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                                    {t('fullNameLabel')}
                                  </label>
                                  <input 
                                    type="text"
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Enter full name"
                                    className="w-full text-xs bg-white border border-stone-200 rounded-xl px-3 py-2.5 focus:outline-hidden focus:border-[#9A3412] text-stone-900 font-medium shadow-2xs placeholder-stone-400"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                                    {t('phoneLabel')}
                                  </label>
                                  <input 
                                    type="tel"
                                    required
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+94771234567"
                                    className="w-full text-xs bg-white border border-stone-200 rounded-xl px-3 py-2.5 focus:outline-hidden focus:border-[#9A3412] text-stone-900 font-medium shadow-2xs placeholder-stone-400"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                                  {t('districtLabel')}
                                </label>
                                <select 
                                  value={district}
                                  onChange={(e) => setDistrict(e.target.value)}
                                  className="w-full text-xs bg-white border border-stone-200 rounded-xl px-3 py-2.5 focus:outline-hidden focus:border-[#9A3412] text-stone-900 font-medium shadow-2xs"
                                >
                                  {districts.map(d => (
                                    <option key={d} value={d}>{d}</option>
                                  ))}
                                </select>
                              </div>

                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                                  Stance Reason / Comments *
                                </label>
                                <textarea 
                                  required
                                  value={comment}
                                  onChange={(e) => setComment(e.target.value)}
                                  rows={2.5}
                                  placeholder="Briefly state your arguments or community concerns..."
                                  className="w-full text-xs bg-white border border-stone-200 rounded-xl px-3.5 py-2 focus:outline-hidden focus:border-[#9A3412] text-stone-900 placeholder-stone-400 font-medium resize-none shadow-2xs"
                                />
                              </div>

                              {/* Drawing Board with dash lines */}
                              <div>
                                <div className="flex justify-between items-center mb-1 gap-2">
                                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500">
                                    {t('drawSignatureLabel')}
                                  </label>
                                  <button 
                                    type="button" 
                                    onClick={clearCanvas}
                                    className="text-[10px] font-bold text-[#9A3412] hover:underline"
                                  >
                                    {t('clearSignature')}
                                  </button>
                                </div>
                                
                                <div className="border-2 border-dashed border-stone-300 rounded-xl bg-white overflow-hidden cursor-crosshair relative">
                                  <canvas 
                                    ref={canvasRef}
                                    width={320}
                                    height={110}
                                    onMouseDown={startDrawing}
                                    onMouseMove={draw}
                                    onMouseUp={stopDrawing}
                                    onMouseLeave={stopDrawing}
                                    onTouchStart={startDrawing}
                                    onTouchMove={draw}
                                    onTouchEnd={stopDrawing}
                                    className="w-full h-[110px] block bg-white relative z-10"
                                  />
                                  {!hasDrawn && (
                                    <div className="absolute inset-0 flex items-center justify-center text-[11px] text-stone-300 font-serif select-none pointer-events-none tracking-wider italic z-0">
                                      Draw Signature Here / இக்கட்டத்தில் கையொப்பமிடுக
                                    </div>
                                  )}
                                </div>
                              </div>

                              <button 
                                type="submit"
                                disabled={submittingVote}
                                className="w-full text-xs font-black uppercase tracking-widest text-white bg-[#9A3412] hover:bg-[#78350F] disabled:bg-stone-400 py-3.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.01] text-center"
                              >
                                {submittingVote ? 'Broadcasting Opinion Vote...' : 'Transmit Sovereign Vote'}
                              </button>
                            </form>
                          </div>

                        </div>

                        {/* Chronological Votes comment list with custom badges */}
                        <div className="mt-12 border-t border-stone-100 pt-10">
                          <div className="flex items-center justify-between mb-6 gap-4">
                            <div>
                              <span className="text-[10px] uppercase tracking-widest font-sans font-semibold text-stone-400">Ledger Log</span>
                              <h4 className="text-xl font-serif font-black text-stone-950">
                                Verified Citizen Stances & Declarations
                              </h4>
                            </div>
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                          </div>

                          {poll.votes && poll.votes.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                              {poll.votes.map((v: any) => {
                                const bgCol = v.option === 'yes' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : v.option === 'no' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-stone-100 border-stone-200 text-stone-700';
                                const stanceLabel = v.option === 'yes' ? 'AGREE' : v.option === 'no' ? 'DISAGREE' : 'NEUTRAL';
                                
                                // Create elegant Initials avatar
                                const initials = v.fullName ? v.fullName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : 'C';

                                return (
                                  <div key={v.id} className="bg-white border border-stone-200/60 rounded-2xl p-5 flex flex-col justify-between hover:shadow-xs transition-all duration-300">
                                    <div>
                                      <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-2.5 min-w-0">
                                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-stone-100 to-stone-200 border border-stone-300/50 flex items-center justify-center text-xs font-black text-stone-800 shrink-0">
                                            {initials}
                                          </div>
                                          <div className="min-w-0">
                                            <h5 className="text-xs font-black text-stone-900 truncate">
                                              {v.fullName}
                                            </h5>
                                            <span className="text-[10px] text-[#9A3412] font-semibold">
                                              {v.district || 'Colombo'} District
                                            </span>
                                          </div>
                                        </div>
                                        <span className={`text-[9px] font-black tracking-widest px-2 py-0.5 rounded-sm border shrink-0 ${bgCol}`}>
                                          {stanceLabel}
                                        </span>
                                      </div>

                                      {v.comment && (
                                        <p className="text-xs font-serif italic text-stone-700 mt-3.5 leading-relaxed bg-[#FAF9F6] p-3 rounded-xl border border-stone-150">
                                          "{v.comment}"
                                        </p>
                                      )}
                                    </div>

                                    {v.signatureImageUrl && (
                                      <div className="mt-4 pt-3.5 border-t border-stone-100 flex justify-between items-center gap-2">
                                        <span className="text-[9px] text-stone-400 font-mono">
                                          {new Date(v.createdAt).toLocaleDateString()}
                                        </span>
                                        <div className="flex items-center gap-1.5 bg-white rounded border border-stone-200 px-2 py-1 shadow-2xs">
                                          <span className="text-[8px] font-mono uppercase tracking-widest text-stone-400">Signed</span>
                                          <img 
                                            src={v.signatureImageUrl} 
                                            alt="Signature" 
                                            className="h-8 object-contain w-16"
                                            referrerPolicy="no-referrer"
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="py-12 text-center bg-[#FAF9F6] border border-dashed border-stone-200 rounded-2xl">
                              <p className="text-xs text-stone-400 italic">No opinions registered for this poll yet. Be the first to express your stance!</p>
                            </div>
                          )}
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-24 text-center text-stone-500 bg-white border border-stone-200 rounded-2xl">
                <p className="text-sm italic">No opinion polls created yet.</p>
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: Explore Other Petitions */}
        {activeTab === 'explore' && (
          <div>
            <div className="max-w-2xl">
              <span className="text-xs uppercase tracking-widest font-sans font-semibold text-stone-500">Sri Lanka Advocacies</span>
              <h2 className="text-3xl font-serif font-bold text-stone-950 mt-1">
                {t('exploreHeading')}
              </h2>
              <p className="text-sm text-stone-600 mt-2">
                {t('exploreSubheading')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
              {petitions.map((p) => {
                const isAnojan = p.slug === 'save-anojan';
                const localized = getPetitionContent(p.slug, p.title, p.description);
                return (
                  <div key={p.id} className="bg-white border border-stone-200 rounded-xl overflow-hidden flex flex-col hover:border-stone-300 transition-all shadow-xs">
                    
                    {/* Visual Card Media Fallback */}
                    <div className="aspect-16/10 bg-stone-950 relative overflow-hidden flex flex-col justify-end p-6 border-b border-stone-100">
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt="Campaign" className="absolute inset-0 w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center opacity-5">
                          {isAnojan ? <ScaleSVG /> : <Globe size={120} />}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent"></div>
                      
                      <div className="relative z-10">
                        <span className="text-[10px] font-semibold tracking-wider text-white bg-[#9A3412] px-2 py-0.5 rounded-xs uppercase">
                          {isAnojan ? 'Flagship Campaign' : 'Citizen Initiative'}
                        </span>
                        <h4 className="text-lg font-serif font-semibold text-white mt-2 leading-snug line-clamp-2">
                          {localized.title}
                        </h4>
                      </div>
                    </div>

                    <div className="p-6 flex-grow flex flex-col justify-between">
                      <div>
                        <p className="text-stone-600 text-sm line-clamp-3 leading-relaxed">
                          {localized.description.replace(/\*/g, '')}
                        </p>
                        
                        <div className="mt-4 flex items-center justify-between text-xs text-stone-500">
                          <span>Signatures: <strong className="text-stone-900 font-semibold">{formatNumber(p.currentCount)}</strong></span>
                          <span>Goal: {formatNumber(p.targetCount)}</span>
                        </div>

                        <div className="mt-2 w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-[#9A3412] h-1.5 rounded-full" 
                            style={{ width: `${Math.min(100, (p.currentCount / p.targetCount) * 100)}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-stone-100 flex justify-end">
                        <button 
                          onClick={() => { setSelectedPetitionSlug(p.slug); setActiveTab('home'); }}
                          className="text-xs font-semibold text-[#9A3412] hover:text-[#78350F] flex items-center gap-1 hover:underline"
                        >
                          {currentLanguage === 'ar' ? 'عرض العريضة والتوقيع' : 'Read Case & Sign'} <ChevronRight size={14} />
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 3: Public Transparency Ledger */}
        {activeTab === 'ledger' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs uppercase tracking-widest font-sans font-semibold text-stone-500">
                {t('verifiedList')}
              </span>
              <h2 className="text-3xl font-serif font-bold text-stone-950 mt-1">
                {t('ledgerTab')}
              </h2>
              <p className="text-sm text-stone-600 mt-2 leading-relaxed">
                {t('verifiedNote')}
              </p>
            </div>

            <div className="mt-12 bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs">
              <div className="bg-stone-50 px-6 py-4 border-b border-stone-200 flex justify-between items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  {t('ledgerTab')}
                </span>
                <span className="text-[10px] font-semibold text-[#9A3412] bg-[#9A3412]/5 px-2.5 py-1 rounded">
                  100% Genuine Citizens Verified
                </span>
              </div>

              {loading ? (
                <div className="p-12 text-center text-xs text-stone-500">{t('loading')}</div>
              ) : selectedPetition && selectedPetition.signatures && selectedPetition.signatures.length > 0 ? (
                <div className="divide-y divide-stone-150">
                  {selectedPetition.signatures.map((sig, idx) => (
                    <div key={sig.id || idx} className="p-6 flex flex-col sm:flex-row sm:items-start gap-4 hover:bg-stone-50/50 transition-colors">
                      <div className="w-16 h-16 shrink-0 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center p-1 overflow-hidden">
                        <img 
                          src={sig.signatureImageUrl} 
                          alt="Signature Image" 
                          className="max-h-full max-w-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                          <span className="font-serif font-bold text-stone-900 text-base">
                            {sig.fullName}
                          </span>
                          <span className="text-[11px] text-stone-400 font-mono">
                            {new Date(sig.createdAt).toLocaleString()}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-stone-500 mt-1">
                          <span>District: <strong className="text-stone-700">{sig.district}</strong></span>
                          <span aria-hidden="true" className="text-stone-300">·</span>
                          <span className="text-[10px] font-semibold text-[#9A3412]">Verified Citizen</span>
                        </div>

                        {sig.comment && (
                          <div className="mt-2.5 text-xs font-serif italic text-stone-700 bg-stone-100/60 p-3 rounded-lg leading-relaxed max-w-2xl border border-stone-200/50">
                            "{sig.comment}"
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center text-xs text-stone-500 italic">
                  {t('noSignatures')}
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 4: Start a Petition or Poll */}
        {activeTab === 'start' && (
          session?.role !== 'admin' ? (
            <div className="max-w-md mx-auto bg-white border border-stone-200 rounded-xl p-8 shadow-xs text-center">
              <div className="w-16 h-16 bg-red-100 text-red-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} />
              </div>
              <h2 className="text-2xl font-serif font-bold text-stone-950">Access Denied</h2>
              <p className="text-sm text-stone-600 mt-2">
                {t('onlyAdminAction')}
              </p>
              <button 
                onClick={() => setActiveTab('home')}
                className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-white bg-[#9A3412] hover:bg-[#78350F] px-4 py-2 rounded-lg transition-colors border border-transparent shadow-xs"
              >
                Go Back to Homepage
              </button>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto bg-white border border-stone-200 rounded-xl p-8 shadow-xs">
              <div className="text-center max-w-md mx-auto mb-6">
                <span className="text-xs uppercase tracking-widest font-sans font-semibold text-stone-500">
                  Administrative Creator Hub
                </span>
                <h2 className="text-3xl font-serif font-bold text-stone-950 mt-1">
                  Launch New Initiative
                </h2>
                <p className="text-xs text-stone-600 mt-2">
                  Empower the sovereign citizens of Sri Lanka by starting direct democratic dialogues.
                </p>
              </div>

              {/* Sub-tab Switcher */}
              <div className="flex border-b border-stone-200 mb-8">
                <button
                  type="button"
                  onClick={() => { setStartMode('campaign'); setCreateSuccess(false); }}
                  className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider text-center border-b-2 transition-all ${startMode === 'campaign' ? 'border-[#9A3412] text-[#9A3412]' : 'border-transparent text-stone-500 hover:text-stone-800'}`}
                >
                  Campaign (Petition)
                </button>
                <button
                  type="button"
                  onClick={() => { setStartMode('poll'); setCreatePollSuccess(false); }}
                  className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider text-center border-b-2 transition-all ${startMode === 'poll' ? 'border-[#9A3412] text-[#9A3412]' : 'border-transparent text-stone-500 hover:text-stone-800'}`}
                >
                  Opinion Poll
                </button>
              </div>

              {/* Campaign Form Section */}
              {startMode === 'campaign' && (
                createSuccess ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 text-center">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Check size={24} />
                    </div>
                    <h4 className="text-base font-semibold text-emerald-900">{t('formSuccess')}</h4>
                    <button 
                      onClick={() => setActiveTab('explore')}
                      className="mt-4 text-xs font-semibold text-[#9A3412] hover:underline"
                    >
                      {t('exploreTab')}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleCreatePetition} className="space-y-6">
                    {createError && (
                      <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
                        <AlertCircle size={16} />
                        {createError}
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                        {t('formTitle')}
                      </label>
                      <input 
                        type="text"
                        required
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="e.g. Protect wetlands in Jaffna peninsula"
                        className="w-full text-sm bg-[#FAF9F6] border border-stone-300 rounded-lg px-3.5 py-2 focus:outline-hidden focus:border-[#9A3412] text-stone-900 placeholder-stone-400 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                        {t('formDesc')}
                      </label>
                      <textarea 
                        required
                        rows={6}
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        placeholder="Provide detailed reasons for your petition..."
                        className="w-full text-sm bg-[#FAF9F6] border border-stone-300 rounded-lg px-3.5 py-2.5 focus:outline-hidden focus:border-[#9A3412] text-stone-900 placeholder-stone-400 font-medium resize-y"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                        {t('formTarget')}
                      </label>
                      <input 
                        type="number"
                        required
                        min="1"
                        placeholder="e.g. 100000"
                        value={newTargetCount}
                        onChange={(e) => setNewTargetCount(e.target.value)}
                        className="w-full text-sm bg-[#FAF9F6] border border-stone-300 rounded-lg px-3.5 py-2.5 focus:outline-hidden focus:border-[#9A3412] text-stone-900 placeholder-stone-400 font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                          Campaign Image URL (Optional)
                        </label>
                        <input 
                          type="url"
                          value={newImageUrl}
                          onChange={(e) => setNewImageUrl(e.target.value)}
                          placeholder="https://example.com/image.png"
                          className="w-full text-sm bg-[#FAF9F6] border border-stone-300 rounded-lg px-3.5 py-2 focus:outline-hidden focus:border-[#9A3412] text-stone-900 font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                          Or Upload Image File
                        </label>
                        <input 
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          className="w-full text-sm bg-[#FAF9F6] border border-stone-300 rounded-lg px-3.5 py-1.5 focus:outline-hidden focus:border-[#9A3412] text-stone-900 font-medium file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#9A3412]/10 file:text-[#9A3412] hover:file:bg-[#9A3412]/20"
                        />
                      </div>
                    </div>

                    {newImageBase64 && (
                      <div className="mt-2">
                        <p className="text-xs font-semibold text-stone-500 mb-1">Image Preview:</p>
                        <img 
                          src={newImageBase64} 
                          alt="Preview" 
                          className="h-28 rounded-lg border border-stone-200 object-cover" 
                        />
                      </div>
                    )}

                    <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-600">
                      <p className="font-semibold text-stone-900 mb-1">Organizer credentials declaration:</p>
                      You are publishing this petition under the verified profile name: <strong className="text-[#9A3412]">{session?.fullName}</strong>.
                    </div>

                    <button 
                      type="submit"
                      className="w-full text-sm font-semibold text-white bg-[#9A3412] hover:bg-[#78350F] py-3 rounded-lg transition-colors border border-transparent shadow-xs"
                    >
                      {t('formButton')}
                    </button>
                  </form>
                )
              )}

              {/* Public Opinion Poll Form Section */}
              {startMode === 'poll' && (
                createPollSuccess ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 text-center">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Check size={24} />
                    </div>
                    <h4 className="text-base font-semibold text-emerald-900">Opinion Poll Launched Successfully!</h4>
                    <button 
                      onClick={() => setActiveTab('polls')}
                      className="mt-4 text-xs font-semibold text-[#9A3412] hover:underline"
                    >
                      Go to Direct Voting Hub
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleCreatePoll} className="space-y-6">
                    {createPollError && (
                      <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
                        <AlertCircle size={16} />
                        {createPollError}
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                        Poll Question / Headline *
                      </label>
                      <input 
                        type="text"
                        required
                        value={newPollTitle}
                        onChange={(e) => setNewPollTitle(e.target.value)}
                        placeholder="e.g. Do you support executive constitutional amendments?"
                        className="w-full text-sm bg-[#FAF9F6] border border-stone-300 rounded-lg px-3.5 py-2 focus:outline-hidden focus:border-[#9A3412] text-stone-900 placeholder-stone-400 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                        Detailed Explanatory Narrative *
                      </label>
                      <textarea 
                        required
                        rows={6}
                        value={newPollDescription}
                        onChange={(e) => setNewPollDescription(e.target.value)}
                        placeholder="Explain the background context, options, and national weight of this vote..."
                        className="w-full text-sm bg-[#FAF9F6] border border-stone-300 rounded-lg px-3.5 py-2.5 focus:outline-hidden focus:border-[#9A3412] text-stone-900 placeholder-stone-400 font-medium resize-y"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                        Explanatory Banner Graphic URL (Optional)
                      </label>
                      <input 
                        type="url"
                        value={newPollImageUrl}
                        onChange={(e) => setNewPollImageUrl(e.target.value)}
                        placeholder="e.g. https://domain.com/graphics/constitution-poll.png"
                        className="w-full text-sm bg-[#FAF9F6] border border-stone-300 rounded-lg px-3.5 py-2 focus:outline-hidden focus:border-[#9A3412] text-stone-900 placeholder-stone-400 font-medium"
                      />
                    </div>

                    <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-600">
                      <p className="font-semibold text-stone-900 mb-1">Direct democracy declaration:</p>
                      This poll will instantly gather citizen agree/disagree/neutral votes with verified drawings and reasons across Sri Lankan districts.
                    </div>

                    <button 
                      type="submit"
                      className="w-full text-sm font-semibold text-white bg-[#9A3412] hover:bg-[#78350F] py-3 rounded-lg transition-colors border border-transparent shadow-xs"
                    >
                      Launch Opinion Poll
                    </button>
                  </form>
                )
              )}
            </div>
          )
        )}

        {/* VIEW 5: User Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6 mb-8">
              <div>
                <span className="text-xs uppercase tracking-widest font-sans font-semibold text-stone-500">
                  {t('dashboard')}
                </span>
                <h2 className="text-3xl font-serif font-bold text-stone-950 mt-1">
                  {t('dashboardTitle')}
                </h2>
                <p className="text-xs text-stone-600 mt-1">
                  {t('dashboardSub')}
                </p>
              </div>

              <div className="p-3 bg-stone-100 border border-stone-200 rounded-xl flex items-center gap-3">
                <div className="w-9 h-9 bg-[#9A3412]/10 text-[#9A3412] rounded-full flex items-center justify-center">
                  <User size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">{session?.fullName}</h4>
                  <p className="text-[10px] text-stone-500">{session?.phone}</p>
                </div>
              </div>
            </div>

            {loadingDashboard ? (
              <div className="py-12 text-center text-xs text-stone-500 italic">Gathering records...</div>
            ) : dashboardData ? (
              <div className="space-y-12">
                
                {/* Section A: Managed/Created Campaigns with SIGNER DETAILS & CSV EXPORT */}
                <div>
                  <h3 className="text-xl font-serif font-bold text-stone-950 mb-4 flex items-center gap-2">
                    <Award size={18} className="text-[#9A3412]" /> 
                    {t('createdPetitionsHeading')}
                  </h3>

                  {dashboardData.managedCampaigns && dashboardData.managedCampaigns.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                      {dashboardData.managedCampaigns.map((camp) => (
                        <div key={camp.id} className="bg-white border border-stone-200 rounded-xl p-6 shadow-2xs">
                          
                          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-stone-100 pb-4 mb-4">
                            <div>
                              <h4 className="text-lg font-serif font-bold text-stone-900">{camp.title}</h4>
                              <p className="text-[11px] text-stone-500 mt-0.5">{t('launchedDate')}: {new Date(camp.createdAt).toLocaleDateString()}</p>
                            </div>
                            
                            {/* Working Signatures CSV Exporter */}
                            <a 
                              href={`/api/petitions/${camp.id}/export-csv?userId=${session?.id || ''}&token=${session?.token || ''}`}
                              download
                              className="self-start sm:self-center flex items-center gap-1.5 text-xs font-semibold text-white bg-[#9A3412] hover:bg-[#78350F] px-4 py-2 rounded-lg transition-colors border border-transparent"
                            >
                              <Download size={14} />
                              {t('exportCsv')}
                            </a>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-2">
                            <div className="bg-stone-50 p-3 rounded-lg border border-stone-100">
                              <span className="text-[10px] uppercase text-stone-500 block font-semibold">{t('totalSigs')}</span>
                              <strong className="text-lg font-mono text-stone-900">{formatNumber(camp.currentCount)}</strong>
                            </div>
                            <div className="bg-stone-50 p-3 rounded-lg border border-stone-100">
                              <span className="text-[10px] uppercase text-stone-500 block font-semibold">{t('targetLabel')}</span>
                              <strong className="text-lg font-mono text-stone-900">{formatNumber(camp.targetCount)}</strong>
                            </div>
                            <div className="bg-stone-50 p-3 rounded-lg border border-stone-100">
                              <span className="text-[10px] uppercase text-stone-500 block font-semibold">{t('successRate')}</span>
                              <strong className="text-lg font-mono text-stone-900">{((camp.currentCount / camp.targetCount) * 100).toFixed(1)}%</strong>
                            </div>
                            <div className="bg-stone-50 p-3 rounded-lg border border-stone-100">
                              <span className="text-[10px] uppercase text-stone-500 block font-semibold">{t('statusLabel')}</span>
                              <strong className="text-xs font-bold text-[#9A3412] tracking-wide block mt-1.5 uppercase">{t('campaignActive')}</strong>
                            </div>
                          </div>

                          {/* Detailed Signers Ledger for This Created Petition */}
                          <div className="mt-6">
                            <h5 className="text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
                              {t('recentSigsTable')} ({camp.signatures?.length || 0})
                            </h5>
                            
                            {camp.signatures && camp.signatures.length > 0 ? (
                              <div className="border border-stone-200 rounded-lg overflow-hidden max-h-60 overflow-y-auto">
                                <table className="w-full text-left text-xs border-collapse">
                                  <thead>
                                    <tr className="bg-stone-100 border-b border-stone-200 text-stone-600 font-semibold">
                                      <th className="p-2.5">{t('nameCol')}</th>
                                      <th className="p-2.5">{t('phoneCol')}</th>
                                      <th className="p-2.5">District</th>
                                      <th className="p-2.5">{t('dateCol')}</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-stone-100 font-medium">
                                    {camp.signatures.map((s, sIdx) => (
                                      <tr key={s.id || sIdx} className="hover:bg-stone-50">
                                        <td className="p-2.5 text-stone-900 font-bold">{s.fullName}</td>
                                        <td className="p-2.5 text-stone-500">{s.phone}</td>
                                        <td className="p-2.5 text-stone-600">{s.district}</td>
                                        <td className="p-2.5 text-stone-400">{new Date(s.createdAt).toLocaleDateString()}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <p className="text-xs text-stone-400 italic">No signatures recorded yet.</p>
                            )}
                          </div>

                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white border border-stone-200 rounded-xl p-8 text-center text-xs text-stone-500 italic font-medium">
                      {t('noCreatedPetitions')}
                    </div>
                  )}
                </div>

                {/* Section B: Signed Petitions list */}
                <div>
                  <h3 className="text-xl font-serif font-bold text-stone-950 mb-4 flex items-center gap-2">
                    <Check size={18} className="text-[#9A3412]" /> 
                    {t('signedPetitionsHeading')}
                  </h3>

                  {dashboardData.signedPetitions && dashboardData.signedPetitions.length > 0 ? (
                    <div className="bg-white border border-stone-200 rounded-xl divide-y divide-stone-150 shadow-2xs">
                      {dashboardData.signedPetitions.map((p) => (
                        <div key={p.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <h4 className="text-sm font-serif font-bold text-stone-900">{getPetitionContent(p.slug, p.title, p.description).title}</h4>
                            <p className="text-xs text-stone-500 mt-0.5">Signatures: {formatNumber(p.currentCount)} / {formatNumber(p.targetCount)}</p>
                          </div>
                          
                          <button 
                            onClick={() => { setSelectedPetitionSlug(p.slug); setActiveTab('home'); }}
                            className="self-start sm:self-center text-xs font-semibold text-[#9A3412] hover:text-[#78350F] hover:underline whitespace-nowrap"
                          >
                            View Case <ChevronRight size={14} className="inline-block" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-stone-500 italic">{t('noSignedPetitions')}</p>
                  )}
                </div>

              </div>
            ) : null}
          </div>
        )}

        {/* VIEW 6: Sign In / Access Dashboard */}
        {activeTab === 'login' && (
          <div className="max-w-md mx-auto bg-white border border-stone-200 rounded-xl p-8 shadow-xs">
            <div className="text-center mb-6">
              <span className="text-xs uppercase tracking-widest font-sans font-semibold text-stone-500">{t('signIn')}</span>
              <h2 className="text-3xl font-serif font-bold text-stone-950 mt-1">
                {t('loginTitle')}
              </h2>
              <p className="text-xs text-stone-600 mt-2">
                {t('loginSub')}
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle size={16} />
                  {loginError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  {t('phoneCol')}
                </label>
                <input 
                  type="tel"
                  required
                  value={loginPhone}
                  onChange={(e) => setLoginPhone(e.target.value)}
                  placeholder="Enter your phone number..."
                  className="w-full text-sm bg-[#FAF9F6] border border-stone-300 rounded-lg px-3.5 py-2.5 focus:outline-hidden focus:border-[#9A3412] text-stone-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Password
                </label>
                <input 
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your password..."
                  className="w-full text-sm bg-[#FAF9F6] border border-stone-300 rounded-lg px-3.5 py-2.5 focus:outline-hidden focus:border-[#9A3412] text-stone-900 font-medium"
                />
              </div>

              <button 
                type="submit"
                className="w-full text-sm font-semibold text-white bg-[#9A3412] hover:bg-[#78350F] py-3 rounded-lg transition-colors border border-transparent shadow-xs animate-none"
              >
                {t('loginButton')}
              </button>

              <div className="text-center pt-4 border-t border-stone-100 text-[11px] text-stone-500 leading-relaxed">
                <p>No account yet? No worries. Simply sign a petition and your account credentials will be auto-generated instantly.</p>
              </div>
            </form>
          </div>
        )}

      </main>

      {/* Flagship Sovereign Footer */}
      <footer className="bg-stone-950 text-stone-400 border-t border-stone-900 mt-24 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-stone-900 pb-8 mb-8">
            
            <div>
              <span className="text-xl font-serif font-bold text-white tracking-tight">{tNav('platformTitle')}</span>
              <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                {t('footerDesc')}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-stone-300 uppercase tracking-widest mb-3">Links</h4>
              <ul className="space-y-2 text-xs">
                <li><button onClick={() => { setSelectedPetitionSlug('save-anojan'); setActiveTab('home'); }} className="hover:text-white transition-colors">{tNav('flagshipTab')}</button></li>
                <li><button onClick={() => { setActiveTab('explore'); }} className="hover:text-white transition-colors">{tNav('exploreTab')}</button></li>
                <li><button onClick={() => { setActiveTab('ledger'); }} className="hover:text-white transition-colors">{tNav('ledgerTab')}</button></li>
                {session?.role === 'admin' && (
                  <li><button onClick={() => { setActiveTab('start'); }} className="hover:text-white transition-colors">{tNav('startTab')}</button></li>
                )}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-stone-300 uppercase tracking-widest mb-3">Sovereign Accountability & Independence</h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                Change.lk operates as a fully independent, non-governmental (NGO), non-partisan civic registry. We represent direct citizen sovereignty and public welfare without backing any political party or state authority. Stances are recorded securely with modern safeguards.
              </p>
            </div>

          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-600">
            <p>© {new Date().getFullYear()} Changelk. {t('rights')} Built for sovereign public dialogue.</p>
            <div className="flex gap-4">
              <span>{t('footerTrust')}</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

// Decorative justice scales SVG symbol
function ScaleSVG() {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className="w-48 h-48"
    >
      <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1" />
      <path d="M7 16V3" />
      <path d="M21 16v1a2 2 0 0 1-2 2h-4" />
      <path d="M17 16V3" />
      <path d="M2 3h10" />
      <path d="M12 3h10" />
      <path d="M12 3v18" />
      <path d="M12 21H2" />
      <path d="M22 21H12" />
      <circle cx="7" cy="16" r="3" />
      <circle cx="17" cy="16" r="3" />
    </svg>
  );
}

function SaudiFlagSVG() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 16" className="w-full h-full shadow-lg rounded">
      <rect width="24" height="16" fill="#006C35" />
      <path d="M4 11h16M12 4c-2 1-3 2-3 4s2 1 3 1" stroke="#fff" strokeWidth="0.8" fill="none" />
      <path d="M6 12.5l12-0.1" stroke="#fff" strokeWidth="0.8" strokeLinecap="round" />
    </svg>
  );
}

function SriLankanFlagSVG() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 12" className="w-full h-full shadow-lg rounded">
      <rect width="24" height="12" fill="#FFBE29" />
      <rect x="1" y="1" width="3" height="10" fill="#005F4B" />
      <rect x="4" y="1" width="3" height="10" fill="#EB7A23" />
      <rect x="8" y="1" width="15" height="10" fill="#8D153B" />
      {/* Small sword element */}
      <path d="M11 7h5l1-1m-1 2l1-1" stroke="#FFBE29" strokeWidth="0.8" fill="none" />
    </svg>
  );
}

function MotherGraphicSVG() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 270" className="w-full h-full object-cover">
      <defs>
        <linearGradient id="motherBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2E1C0C" />
          <stop offset="100%" stopColor="#1A0D04" />
        </linearGradient>
      </defs>
      <rect width="200" height="270" fill="url(#motherBg)" />
      
      {/* Background warm lights */}
      <circle cx="100" cy="110" r="70" fill="#E2B35B" opacity="0.12" filter="blur(20px)" />
      
      {/* Character body (mother in blue outfit) */}
      <path d="M30 270c10-50 25-100 70-100s60 50 70 100Z" fill="#3D5A80" />
      <path d="M40 270c5-45 15-85 60-85s50 40 60 85Z" fill="#293241" opacity="0.4" />
      
      {/* Head and neck */}
      <path d="M90 145v20h20v-20Z" fill="#D4A373" />
      <circle cx="100" cy="115" r="35" fill="#D4A373" />
      
      {/* Red bindi on forehead */}
      <circle cx="100" cy="100" r="3.5" fill="#C1121F" />
      
      {/* Sorrowful expression - eyebrows & eyes */}
      <path d="M82 110c3-3 8-3 10-1m16-1c2-2 7-2 10 1" stroke="#1A0D04" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M84 118c4 1 8 0 10-2m12 2c4 1 8 0 10-2" stroke="#1A0D04" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      
      {/* Closed mouth with slight grief curve */}
      <path d="M94 136q6 2 12 0" stroke="#1A0D04" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      
      {/* Sorrowful clasped hands gesture silhouette at bottom */}
      <path d="M80 230c10-10 15-12 20-3s10-7 20 3c5 5 2 15-2 20s-15 15-20 15s-16-10-20-15s-3-15 2-20Z" fill="#C39E7C" opacity="0.9" />
      <path d="M90 235c5-5 8-5 10 0s5-5 10 0" stroke="#1A0D04" strokeWidth="1" fill="none" />
    </svg>
  );
}

function AnojanGraphicSVG() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 175" className="w-full h-full object-cover">
      <defs>
        <linearGradient id="anojanBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4A90E2" />
          <stop offset="100%" stopColor="#50E3C2" />
        </linearGradient>
      </defs>
      <rect width="130" height="175" fill="url(#anojanBg)" />
      
      {/* Sports jersey (Purple & Gold Cricket Kit "SV TITANS") */}
      <path d="M15 175c10-35 20-65 50-65s40 30 50 65Z" fill="#4B0082" />
      {/* Gold sleeves / shoulders */}
      <path d="M15 175c4-20 12-40 25-50l-12 15Z" fill="#FFD700" />
      <path d="M115 175c-4-20-12-40-25-50l12 15Z" fill="#FFD700" />
      
      {/* Neck & Face */}
      <path d="M57 95v15h16V95Z" fill="#E0AC76" />
      <circle cx="65" cy="75" r="24" fill="#E0AC76" />
      
      {/* Hair & beard of Anojan */}
      <path d="M43 70c0-15 10-22 22-22s22 7 22 22c0 2-4-2-8-2s-10 3-14 3s-10-3-14-3c-4 0-8 4-8 2Z" fill="#1A1A1A" />
      <path d="M41 78c2 15 10 24 24 24s22-9 24-24c-2 24-10 26-24 26s-22-2-24-26Z" fill="#1A1A1A" />
      
      {/* Smiling eyes and mouth */}
      <path d="M53 72q4-2 8 0m8 0q4-2 8 0" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M57 86q8 5 16 0" stroke="#1A1A1A" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      
      {/* Gold Collar lines */}
      <path d="M50 110l15 18l15-18" stroke="#FFD700" strokeWidth="3" fill="none" />
      
      {/* "SV" Text */}
      <text x="65" y="142" fill="#FFD700" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">SV</text>
      <text x="65" y="156" fill="#FFFFFF" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">TITANS</text>
    </svg>
  );
}
