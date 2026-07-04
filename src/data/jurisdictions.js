// ─────────────────────────────────────────────────────────────────────────────
// Jurisdictions — the claims spine. Every fact is a claim, not a score:
//   position claim:   { o, short, statement, ev, cert, asOf, src, changed? }
//     o     = index into the topic's scale (topics.js). null = not established.
//     ev    = evidence type: 'law' | 'index' | 'practice' | 'advisory'
//     cert  = 'established' | 'limited' | 'anecdote'  (how sure we are)
//     asOf  = year/month the fact reflects.  src = key in sources.js OR {org,url}
//     changed = flagged when it moved recently (drives the "what's new" line)
//   obligation claim: { required, deadlineDays?, timing, statement, ev, cert, asOf, src }
//
// A curated seed being hardened by adversarial source-verification. Certainty is
// shown in the UI; nothing here pretends to precision it doesn't have.
// ─────────────────────────────────────────────────────────────────────────────

export const JURISDICTIONS = [
  {
    code: 'US', name: 'United States', flag: 'us', region: 'North America',
    emergency: { general: '911', police: '911', ambulance: '911', fire: '911' },
    claims: {
      same_sex: { o: 3, short: 'Marriage equality', statement: 'Same-sex marriage has been legal nationwide since Obergefell v. Hodges (2015).', ev: 'law', cert: 'established', asOf: '2015', src: 'equaldex' },
      gender_recognition: { o: 1, short: 'Varies by state', statement: 'Changing legal gender is possible, but requirements and availability differ sharply by state.', ev: 'law', cert: 'limited', asOf: '2025', src: 'equaldex' },
      antidiscrimination: { o: 2, short: 'Broad (federal)', statement: 'Federal civil-rights law bars discrimination by race, sex, religion and disability; sexual orientation and gender identity are covered after Bostock (2020).', ev: 'law', cert: 'established', asOf: '2020', src: { org: 'US EEOC', url: 'https://www.eeoc.gov/' } },
      disability_rights: { o: 2, short: 'Strong (ADA)', statement: 'The Americans with Disabilities Act gives strong protection — but the US has signed, not ratified, the UN Convention on the Rights of Persons with Disabilities (CRPD).', ev: 'law', cert: 'established', asOf: '2025', src: { org: 'ADA.gov', url: 'https://www.ada.gov/' } },
      abortion: { o: 1, short: 'Varies by state', statement: 'Since Dobbs (2022) access ranges from banned to available on request depending on the state.', ev: 'law', cert: 'established', asOf: '2022', src: 'crr' },
      cannabis: { o: 3, short: 'Legal in many states', statement: 'Recreationally legal in many states, yet still federally illegal — the rules change at state lines.', ev: 'law', cert: 'established', asOf: '2025', src: { org: 'DEA / state law', url: 'https://www.dea.gov/drug-information/drug-scheduling' } },
      religious_freedom: { o: 2, short: 'Moderate', statement: 'Pew rates US government restrictions on religion as moderate.', ev: 'index', cert: 'established', asOf: '2022', src: 'pew' },
      blasphemy: { o: 2, short: 'No such laws', statement: 'There are no blasphemy laws; speech about religion is protected by the First Amendment.', ev: 'law', cert: 'established', asOf: '2025', src: 'forb' },
      expression: { o: 2, short: 'Free · 81/100', statement: 'Rated Free, 81/100, by Freedom House (2025).', ev: 'index', cert: 'established', asOf: '2025', src: 'freedomhouse' },
      residence_registration: { required: true, deadlineDays: 10, timing: 'within 10 days of an address change', statement: 'There is no city registration, but F-1 students must report any address change in SEVIS within 10 days.', ev: 'law', cert: 'limited', asOf: '2025', src: { org: 'US SEVP', url: 'https://studyinthestates.dhs.gov/' } },
      student_work: { required: false, timing: 'check with your Designated School Official first', statement: 'F-1 students must speak with their Designated School Official (DSO), and a financial declaration is required.', ev: 'law', cert: 'established', asOf: '2025', src: { org: 'US SEVP', url: 'https://studyinthestates.dhs.gov/students/work/working-in-the-united-states' } },
      health_insurance: { required: true, timing: 'before enrolment', statement: 'Not federally required, but most universities make health insurance a condition of enrolment.', ev: 'practice', cert: 'limited', asOf: '2025', src: { org: 'EducationUSA (US State Dept)', url: 'https://educationusa.state.gov/' } },
      medication_import: { required: false, timing: 'carry documentation', statement: 'Carry prescriptions; some ADHD and opioid medicines need extra documentation and may be restricted.', ev: 'advisory', cert: 'limited', asOf: '2025', src: { org: 'US CBP', url: 'https://www.cbp.gov/travel' } },
    },
  },

  {
    code: 'BR', name: 'Brazil', flag: 'br', region: 'South America',
    emergency: { general: '190', police: '190', ambulance: '192', fire: '193' },
    claims: {
      same_sex: { o: 3, short: 'Marriage equality', statement: 'Same-sex marriage has been recognised nationwide since a 2013 National Justice Council ruling.', ev: 'law', cert: 'established', asOf: '2013', src: 'equaldex' },
      gender_recognition: { o: 2, short: 'Self-determination', statement: 'Since 2018 adults can change name and gender at a registry office without surgery or a court order.', ev: 'law', cert: 'established', asOf: '2018', src: 'equaldex' },
      antidiscrimination: { o: 2, short: 'Broad', statement: 'Racism is a crime, and since 2019 the Supreme Court has treated homophobia and transphobia as punishable racism.', ev: 'law', cert: 'established', asOf: '2019', src: { org: 'STF (Supremo Tribunal Federal)', url: 'https://portal.stf.jus.br/' } },
      disability_rights: { o: 2, short: 'Strong', statement: 'The 2015 Inclusion of Persons with Disabilities Act (LBI) is broad; Brazil ratified the UN Convention on the Rights of Persons with Disabilities (CRPD) in 2008.', ev: 'law', cert: 'established', asOf: '2015', src: 'uncrpd' },
      abortion: { o: 1, short: 'Rape / life only', statement: 'Abortion is permitted only for rape, risk to the mother’s life, or anencephaly.', ev: 'law', cert: 'established', asOf: '2025', src: 'crr' },
      cannabis: { o: 1, short: 'Illegal', statement: 'Illegal; personal possession is not jailed but there is no fixed legal amount, leaving it to police discretion.', ev: 'law', cert: 'limited', asOf: '2025', src: { org: 'Lei 11.343/2006 (Planalto)', url: 'https://www.planalto.gov.br/ccivil_03/_ato2004-2006/2006/lei/l11343.htm' } },
      religious_freedom: { o: 3, short: 'Low restrictions', statement: 'Pew rates government restrictions on religion as low.', ev: 'index', cert: 'established', asOf: '2022', src: 'pew' },
      blasphemy: { o: 2, short: 'No such laws', statement: 'No blasphemy laws; religious freedom is constitutionally protected.', ev: 'law', cert: 'established', asOf: '2025', src: 'forb' },
      expression: { o: 2, short: 'Free · 73/100', statement: 'Rated Free, 73/100, by Freedom House (2025).', ev: 'index', cert: 'established', asOf: '2025', src: 'freedomhouse' },
      residence_registration: { required: true, deadlineDays: 30, timing: 'within 30 days of your residence authorisation', statement: 'New residents must register with the Federal Police for the CRNM migration ID within 30 days of the residence authorisation being granted (Decreto 9.199/2017).', ev: 'law', cert: 'established', asOf: '2025', src: { org: 'Polícia Federal', url: 'https://www.gov.br/pf/' } },
      student_work: { required: false, timing: 'generally not permitted', statement: 'Student visas generally do not permit paid work; study-linked internships may be allowed.', ev: 'law', cert: 'limited', asOf: '2025', src: { org: 'Polícia Federal', url: 'https://www.gov.br/pf/' } },
      health_insurance: { required: true, timing: 'before visa / enrolment', statement: 'Proof of health coverage is commonly required for the student visa and enrolment.', ev: 'practice', cert: 'limited', asOf: '2025', src: { org: 'Portal Consular (Itamaraty)', url: 'https://www.gov.br/mre/pt-br/assuntos/portal-consular' } },
      medication_import: { required: false, timing: 'carry prescriptions', statement: 'Carry prescriptions for personal medicines; controlled substances need documentation.', ev: 'advisory', cert: 'limited', asOf: '2025', src: { org: 'ANVISA', url: 'https://www.gov.br/anvisa/' } },
    },
  },

  {
    code: 'DE', name: 'Germany', flag: 'de', region: 'Europe',
    emergency: { general: '112', police: '110', ambulance: '112', fire: '112' },
    claims: {
      same_sex: { o: 3, short: 'Marriage equality', statement: 'Same-sex marriage, with full adoption rights, has been legal since October 2017.', ev: 'law', cert: 'established', asOf: '2017', src: 'equaldex' },
      gender_recognition: { o: 2, short: 'Self-determination', statement: 'The Self-Determination Act (in force November 2024) lets adults change their legal gender by declaration.', ev: 'law', cert: 'established', asOf: '2024', src: 'equaldex', changed: true },
      antidiscrimination: { o: 2, short: 'Broad (AGG)', statement: 'The General Equal Treatment Act (AGG) bars discrimination on race, sex, religion, disability, age and sexual orientation.', ev: 'law', cert: 'established', asOf: '2025', src: { org: 'Antidiskriminierungsstelle', url: 'https://www.antidiskriminierungsstelle.de/' } },
      disability_rights: { o: 2, short: 'Strong', statement: 'Germany ratified the UN Convention on the Rights of Persons with Disabilities (CRPD) in 2009 and has a strong accessibility and inclusion framework.', ev: 'law', cert: 'established', asOf: '2025', src: 'uncrpd' },
      abortion: { o: 3, short: 'On request (≤12 wks)', statement: 'Available on request in the first 12 weeks after mandatory counselling and a waiting period.', ev: 'law', cert: 'established', asOf: '2025', src: 'crr' },
      cannabis: { o: 3, short: 'Legal (2024)', statement: 'Legalised in April 2024 — adults may possess up to 25 g and grow up to three plants for personal use.', ev: 'law', cert: 'established', asOf: '2024', src: { org: 'CanG (BMG)', url: 'https://www.bundesgesundheitsministerium.de/' }, changed: true },
      religious_freedom: { o: 2, short: 'Moderate', statement: 'Pew rates government restrictions on religion as moderate.', ev: 'index', cert: 'established', asOf: '2022', src: 'pew' },
      blasphemy: { o: 1, short: 'On the books', statement: 'A rarely-used provision (§166 StGB) penalises insulting religion in a way that breaches the peace.', ev: 'law', cert: 'established', asOf: '2025', src: 'forb' },
      expression: { o: 2, short: 'Free · 95/100', statement: 'Rated Free, 95/100, by Freedom House (2025).', ev: 'index', cert: 'established', asOf: '2025', src: 'freedomhouse' },
      residence_registration: { required: true, deadlineDays: 14, timing: 'within 14 days of moving in', statement: 'You must register your address (Anmeldung) within 14 days of moving in — it gates your bank account, SIM contract and enrolment.', ev: 'law', cert: 'established', asOf: '2025', src: { org: 'service.berlin.de', url: 'https://service.berlin.de/dienstleistung/120686/' } },
      student_work: { required: false, timing: '140 full or 280 half days per year', statement: 'Non-EU students may work 140 full days (or 280 half days) per year without extra permission.', ev: 'law', cert: 'established', asOf: '2025', src: { org: 'Make it in Germany', url: 'https://www.make-it-in-germany.com/' } },
      health_insurance: { required: true, timing: 'before enrolment', statement: 'Statutory or private health insurance is mandatory to enrol and to obtain your residence permit.', ev: 'law', cert: 'established', asOf: '2025', src: { org: 'Make it in Germany', url: 'https://www.make-it-in-germany.com/' } },
      medication_import: { required: false, timing: 'carry a doctor’s letter', statement: 'Bring prescriptions; for controlled medicines carry a doctor’s letter (Schengen certificate for longer stays).', ev: 'advisory', cert: 'limited', asOf: '2025', src: { org: 'Zoll (customs)', url: 'https://www.zoll.de/' } },
    },
  },

  {
    code: 'NO', name: 'Norway', flag: 'no', region: 'Europe',
    emergency: { general: '112', police: '112', ambulance: '113', fire: '110' },
    claims: {
      same_sex: { o: 3, short: 'Marriage equality', statement: 'Same-sex marriage has been legal since 2009.', ev: 'law', cert: 'established', asOf: '2009', src: 'equaldex' },
      gender_recognition: { o: 2, short: 'Self-determination', statement: 'Since 2016 legal gender can be changed by self-declaration, without medical requirements.', ev: 'law', cert: 'established', asOf: '2016', src: 'equaldex' },
      antidiscrimination: { o: 2, short: 'Broad', statement: 'The Equality and Anti-Discrimination Act protects across gender, ethnicity, religion, disability and sexual orientation.', ev: 'law', cert: 'established', asOf: '2025', src: { org: 'LDO (Equality Ombud)', url: 'https://www.ldo.no/' } },
      disability_rights: { o: 2, short: 'Strong', statement: 'Norway ratified the UN Convention on the Rights of Persons with Disabilities (CRPD) in 2013 and has strong welfare and accessibility standards.', ev: 'law', cert: 'established', asOf: '2025', src: 'uncrpd' },
      abortion: { o: 3, short: 'On request', statement: 'Available on request in the first trimester.', ev: 'law', cert: 'established', asOf: '2025', src: 'crr' },
      cannabis: { o: 1, short: 'Illegal', statement: 'Illegal; small-amount personal use is treated leniently, but sale and possession remain offences.', ev: 'law', cert: 'limited', asOf: '2025', src: { org: 'Legemiddelloven (Lovdata)', url: 'https://lovdata.no/dokument/NL/lov/1992-12-04-132' } },
      religious_freedom: { o: 3, short: 'Low restrictions', statement: 'Pew rates government restrictions on religion as low.', ev: 'index', cert: 'established', asOf: '2022', src: 'pew' },
      blasphemy: { o: 2, short: 'No such laws', statement: 'The blasphemy law was repealed in 2015.', ev: 'law', cert: 'established', asOf: '2015', src: 'forb' },
      expression: { o: 2, short: 'Free · 99/100', statement: 'Rated Free, 99/100, by Freedom House (2025).', ev: 'index', cert: 'established', asOf: '2025', src: 'freedomhouse' },
      residence_registration: { required: true, deadlineDays: 7, timing: 'report to the police / tax office on arrival', statement: 'Non-EEA students collect their residence card and register with the tax office (national ID number) shortly after arrival; EEA nationals register with the police.', ev: 'law', cert: 'limited', asOf: '2025', src: { org: 'UDI', url: 'https://www.udi.no/en/' } },
      student_work: { required: false, timing: '≤20 hrs/week in term', statement: 'The student residence permit allows part-time work up to about 20 hrs/week, full-time in holidays.', ev: 'law', cert: 'established', asOf: '2025', src: { org: 'UDI', url: 'https://www.udi.no/en/' } },
      health_insurance: { required: true, timing: 'on registration', statement: 'Students staying 12+ months join the National Insurance Scheme; shorter stays need private cover.', ev: 'law', cert: 'limited', asOf: '2025', src: { org: 'HELFO', url: 'https://www.helsenorge.no/en/' } },
      medication_import: { required: false, timing: 'carry prescriptions', statement: 'Bring prescriptions; strict limits apply to controlled medicines.', ev: 'advisory', cert: 'limited', asOf: '2025', src: { org: 'Norwegian Customs', url: 'https://www.toll.no/en/' } },
    },
  },

  {
    code: 'KE', name: 'Kenya', flag: 'ke', region: 'Africa',
    emergency: { general: '999', police: '999', ambulance: '999', fire: '999' },
    claims: {
      same_sex: { o: 0, short: 'Criminalised', statement: 'Same-sex sexual acts are criminalised under Penal Code sections 162–165, punishable by up to 14 years; a 2019 case upheld the ban.', ev: 'law', cert: 'established', asOf: '2023', src: 'ilga' },
      gender_recognition: { o: 0, short: 'Not possible', statement: 'There is no legal process to change gender.', ev: 'law', cert: 'limited', asOf: '2025', src: 'equaldex' },
      antidiscrimination: { o: 1, short: 'Partial', statement: 'The Constitution guarantees equality, but there is no comprehensive anti-discrimination law and enforcement is uneven.', ev: 'law', cert: 'limited', asOf: '2025', src: { org: 'Constitution of Kenya, 2010 (Art. 27)', url: 'https://www.constituteproject.org/constitution/Kenya_2010' } },
      disability_rights: { o: 1, short: 'CRPD + basic law', statement: 'Kenya ratified the UN Convention on the Rights of Persons with Disabilities (CRPD) in 2008 and has a Persons with Disabilities Act, but physical access is limited.', ev: 'law', cert: 'established', asOf: '2025', src: 'uncrpd' },
      abortion: { o: 1, short: 'Health / life', statement: 'Permitted where the life or health of the mother is in danger; otherwise restricted.', ev: 'law', cert: 'established', asOf: '2025', src: 'crr' },
      cannabis: { o: 0, short: 'Illegal — severe', statement: 'Illegal with severe penalties under the Narcotic Drugs Act.', ev: 'law', cert: 'established', asOf: '2025', src: { org: 'Wikipedia — Cannabis in Kenya', url: 'https://en.wikipedia.org/wiki/Cannabis_in_Kenya' } },
      religious_freedom: { o: 2, short: 'Moderate', statement: 'Pew rates government restrictions on religion as moderate.', ev: 'index', cert: 'established', asOf: '2022', src: 'pew' },
      blasphemy: { o: 1, short: 'On the books', statement: 'The Penal Code criminalises insulting religion, though prosecutions are rare.', ev: 'law', cert: 'limited', asOf: '2025', src: 'forb' },
      expression: { o: 1, short: 'Partly free · 49/100', statement: 'Rated Partly Free, 49/100, by Freedom House (2025).', ev: 'index', cert: 'established', asOf: '2025', src: 'freedomhouse' },
      residence_registration: { required: true, deadlineDays: 90, timing: 'register for an Alien ID after getting your permit', statement: 'Foreign students register with Immigration and obtain an Alien Registration certificate after their study permit is issued.', ev: 'law', cert: 'limited', asOf: '2025', src: { org: 'Directorate of Immigration', url: 'https://immigration.go.ke/' } },
      student_work: { required: false, timing: 'generally not permitted', statement: 'Student passes generally restrict employment; a separate permit is needed to work.', ev: 'law', cert: 'limited', asOf: '2025', src: { org: 'Directorate of Immigration', url: 'https://immigration.go.ke/' } },
      health_insurance: { required: true, timing: 'before travel', statement: 'Comprehensive private health insurance is strongly advised; public facilities are stretched.', ev: 'advisory', cert: 'limited', asOf: '2025', src: { org: 'US CDC — Kenya travel health', url: 'https://wwwnc.cdc.gov/travel/destinations/traveler/none/kenya' } },
      medication_import: { required: false, timing: 'carry prescriptions', statement: 'Carry prescriptions; note that single-use plastic bags are banned on entry.', ev: 'advisory', cert: 'limited', asOf: '2025', src: { org: 'Kenya Revenue Authority', url: 'https://www.kra.go.ke/' } },
    },
  },

  {
    code: 'EG', name: 'Egypt', flag: 'eg', region: 'Africa / Middle East',
    emergency: { general: '122', police: '122', ambulance: '123', fire: '180' },
    claims: {
      same_sex: { o: 0, short: 'Prosecuted', statement: 'Same-sex acts are not named in law but are actively prosecuted under “debauchery” and morality statutes.', ev: 'law', cert: 'established', asOf: '2025', src: 'ilga' },
      gender_recognition: { o: 0, short: 'Not accessible', statement: 'There is no accessible legal gender-recognition process.', ev: 'law', cert: 'limited', asOf: '2025', src: 'equaldex' },
      antidiscrimination: { o: 1, short: 'Limited', statement: 'Constitutional equality clauses exist, but there is limited enforceable anti-discrimination protection.', ev: 'law', cert: 'limited', asOf: '2025', src: { org: 'Constitution of Egypt, 2019 (Art. 53)', url: 'https://www.constituteproject.org/constitution/Egypt_2019' } },
      disability_rights: { o: 1, short: 'CRPD + basic law', statement: 'Egypt ratified the UN Convention on the Rights of Persons with Disabilities (CRPD) in 2008 and has a disability law, but accessibility is limited.', ev: 'law', cert: 'established', asOf: '2025', src: 'uncrpd' },
      abortion: { o: 0, short: 'Prohibited', statement: 'Effectively prohibited, with only a narrow exception to save the mother’s life.', ev: 'law', cert: 'established', asOf: '2025', src: 'crr' },
      cannabis: { o: 0, short: 'Illegal — severe', statement: 'Illegal with severe penalties.', ev: 'law', cert: 'established', asOf: '2025', src: { org: 'Wikipedia — Cannabis in Egypt', url: 'https://en.wikipedia.org/wiki/Cannabis_in_Egypt' } },
      religious_freedom: { o: 0, short: 'Very high restrictions', statement: 'Pew rates government restrictions on religion among the highest in the world.', ev: 'index', cert: 'established', asOf: '2022', src: 'pew' },
      blasphemy: { o: 0, short: 'Actively enforced', statement: 'Contempt-of-religion (blasphemy) prosecutions occur and can carry prison terms.', ev: 'law', cert: 'established', asOf: '2025', src: 'forb' },
      expression: { o: 0, short: 'Not free · 18/100', statement: 'Rated Not Free, 18/100, by Freedom House (2025).', ev: 'index', cert: 'established', asOf: '2025', src: 'freedomhouse' },
      residence_registration: { required: true, deadlineDays: 7, timing: 'register within 7 days of arrival', statement: 'Foreigners are expected to register with authorities within about a week of arrival; hotels do this for you, but private stays may not.', ev: 'law', cert: 'limited', asOf: '2025', src: { org: 'US State Dept — Egypt', url: 'https://travel.state.gov/content/travel/en/international-travel/International-Travel-Country-Information-Pages/Egypt.html' } },
      student_work: { required: false, timing: 'not permitted', statement: 'Student visas do not permit employment; a separate work permit is required.', ev: 'law', cert: 'limited', asOf: '2025', src: { org: 'US State Dept — Egypt', url: 'https://travel.state.gov/content/travel/en/international-travel/International-Travel-Country-Information-Pages/Egypt.html' } },
      health_insurance: { required: true, timing: 'before travel', statement: 'Private health insurance is strongly advised; public care is basic.', ev: 'advisory', cert: 'limited', asOf: '2025', src: { org: 'US CDC — Egypt travel health', url: 'https://wwwnc.cdc.gov/travel/destinations/traveler/none/egypt' } },
      medication_import: { required: false, timing: 'carry documentation', statement: 'Carry prescriptions; drones are effectively banned and some medicines are restricted.', ev: 'advisory', cert: 'limited', asOf: '2025', src: { org: 'US State Dept — Egypt', url: 'https://travel.state.gov/content/travel/en/international-travel/International-Travel-Country-Information-Pages/Egypt.html' } },
    },
  },

  {
    code: 'ZA', name: 'South Africa', flag: 'za', region: 'Africa',
    emergency: { general: '112', police: '10111', ambulance: '10177', fire: '10111' },
    claims: {
      same_sex: { o: 3, short: 'Marriage equality', statement: 'The first country in Africa to allow same-sex marriage (2006); the Constitution explicitly protects sexual orientation.', ev: 'law', cert: 'established', asOf: '2006', src: 'equaldex' },
      gender_recognition: { o: 1, short: 'Medically gatekept', statement: 'Legal gender change is possible under Act 49 of 2003 but requires medical evidence and can be slow.', ev: 'law', cert: 'limited', asOf: '2025', src: 'equaldex' },
      antidiscrimination: { o: 2, short: 'Broad', statement: 'The Constitution and PEPUDA provide strong, wide-ranging anti-discrimination protection.', ev: 'law', cert: 'established', asOf: '2025', src: { org: 'SAHRC', url: 'https://www.sahrc.org.za/' } },
      disability_rights: { o: 1, short: 'CRPD + policy', statement: 'South Africa ratified the UN Convention on the Rights of Persons with Disabilities (CRPD) in 2007; policy exists but physical accessibility is inconsistent.', ev: 'law', cert: 'established', asOf: '2025', src: 'uncrpd' },
      abortion: { o: 3, short: 'On request', statement: 'Available on request in the first trimester under the 1996 Choice on Termination of Pregnancy Act.', ev: 'law', cert: 'established', asOf: '2025', src: 'crr' },
      cannabis: { o: 3, short: 'Private use legal', statement: 'Private personal use and cultivation are legal (2018 Constitutional Court ruling); there is no legal retail sale.', ev: 'law', cert: 'established', asOf: '2018', src: { org: 'Wikipedia — Cannabis in South Africa', url: 'https://en.wikipedia.org/wiki/Cannabis_in_South_Africa' } },
      religious_freedom: { o: 3, short: 'Low restrictions', statement: 'Pew rates government restrictions on religion as low.', ev: 'index', cert: 'established', asOf: '2022', src: 'pew' },
      blasphemy: { o: 2, short: 'No such laws', statement: 'No enforced blasphemy laws; religious freedom is constitutionally protected.', ev: 'law', cert: 'established', asOf: '2025', src: 'forb' },
      expression: { o: 2, short: 'Free · 81/100', statement: 'Rated Free, 81/100, by Freedom House (2025).', ev: 'index', cert: 'established', asOf: '2025', src: 'freedomhouse' },
      residence_registration: { required: false, timing: 'no separate registration', statement: 'No general address registration; keep your study visa and passport valid and accessible.', ev: 'law', cert: 'limited', asOf: '2025', src: { org: 'Dept of Home Affairs', url: 'https://www.dha.gov.za/' } },
      student_work: { required: false, timing: '≤20 hrs/week in term', statement: 'A study visa allows part-time work up to 20 hrs/week during term.', ev: 'law', cert: 'established', asOf: '2025', src: { org: 'Dept of Home Affairs', url: 'https://www.dha.gov.za/' } },
      health_insurance: { required: true, timing: 'before visa', statement: 'Proof of medical cover with a South African provider is required for the study visa.', ev: 'law', cert: 'limited', asOf: '2025', src: { org: 'Dept of Home Affairs', url: 'https://www.dha.gov.za/' } },
      medication_import: { required: false, timing: 'carry prescriptions', statement: 'Carry prescriptions for scheduled medicines.', ev: 'advisory', cert: 'limited', asOf: '2025', src: { org: 'SAHPRA', url: 'https://www.sahpra.org.za/' } },
    },
  },

  {
    code: 'CN', name: 'China', flag: 'cn', region: 'Asia',
    emergency: { general: '110', police: '110', ambulance: '120', fire: '119' },
    claims: {
      same_sex: { o: 1, short: 'Legal, no recognition', statement: 'Same-sex activity has been legal since 1997, but there is no legal recognition of relationships.', ev: 'law', cert: 'established', asOf: '2025', src: 'equaldex' },
      gender_recognition: { o: 1, short: 'Medically gatekept', statement: 'Changing legal gender is possible but conditional on surgery and other requirements.', ev: 'law', cert: 'limited', asOf: '2025', src: 'equaldex' },
      antidiscrimination: { o: 0, short: 'No general protection', statement: 'There is no general anti-discrimination law, and serious concerns exist about ethnic-minority repression.', ev: 'law', cert: 'limited', asOf: '2025', src: { org: 'Human Rights Watch — China', url: 'https://www.hrw.org/asia/china' } },
      disability_rights: { o: 1, short: 'CRPD + basic law', statement: 'China ratified the UN Convention on the Rights of Persons with Disabilities (CRPD) in 2008; accessibility is improving in major cities but uneven.', ev: 'law', cert: 'established', asOf: '2025', src: 'uncrpd' },
      abortion: { o: 3, short: 'Broadly available', statement: 'Abortion is broadly available and legal.', ev: 'law', cert: 'established', asOf: '2025', src: 'crr' },
      cannabis: { o: 0, short: 'Illegal — severe', statement: 'Illegal with severe penalties — including for residues detectable after you return home.', ev: 'law', cert: 'established', asOf: '2025', src: { org: 'Wikipedia — Cannabis in China', url: 'https://en.wikipedia.org/wiki/Cannabis_in_China' } },
      religious_freedom: { o: 0, short: 'Very high restrictions', statement: 'Pew rates government restrictions on religion among the highest in the world; the state controls religion.', ev: 'index', cert: 'established', asOf: '2022', src: 'pew' },
      blasphemy: { o: 0, short: 'State control', statement: 'The state controls religious practice; unregistered worship and “harmful” religious content are penalised.', ev: 'law', cert: 'established', asOf: '2025', src: 'forb' },
      expression: { o: 0, short: 'Not free · 9/100', statement: 'Rated Not Free, 9/100, by Freedom House (2025); Google, WhatsApp, Instagram and X are blocked.', ev: 'index', cert: 'established', asOf: '2025', src: 'freedomhouse' },
      residence_registration: { required: true, deadlineDays: 1, timing: 'within 24 hours of arrival', statement: 'You must register your address with the local police within 24 hours of arrival if you are not staying in a hotel (hotels register you automatically).', ev: 'law', cert: 'established', asOf: '2025', src: { org: 'National Immigration Administration', url: 'https://en.nia.gov.cn/' } },
      student_work: { required: false, timing: 'needs university + police approval', statement: 'Work is generally prohibited on a student (X) visa without approval from your university and the police.', ev: 'law', cert: 'established', asOf: '2025', src: { org: 'National Immigration Administration', url: 'https://en.nia.gov.cn/' } },
      health_insurance: { required: true, timing: 'before enrolment', statement: 'Comprehensive insurance is required for the study visa and enrolment.', ev: 'law', cert: 'limited', asOf: '2025', src: { org: 'National Immigration Administration', url: 'https://en.nia.gov.cn/' } },
      medication_import: { required: false, timing: 'carry documentation', statement: 'Some medicines are restricted; carry documentation and check before bringing psychiatric or strong painkiller prescriptions.', ev: 'advisory', cert: 'limited', asOf: '2025', src: { org: 'China Customs', url: 'http://english.customs.gov.cn/' } },
    },
  },

  {
    code: 'AU', name: 'Australia', flag: 'au', region: 'Oceania',
    emergency: { general: '000', police: '000', ambulance: '000', fire: '000' },
    claims: {
      same_sex: { o: 3, short: 'Marriage equality', statement: 'Same-sex marriage has been legal nationwide since December 2017.', ev: 'law', cert: 'established', asOf: '2017', src: 'equaldex' },
      gender_recognition: { o: 2, short: 'Largely self-ID', statement: 'Most states allow changing legal sex without surgery; requirements vary by state.', ev: 'law', cert: 'limited', asOf: '2025', src: 'equaldex' },
      antidiscrimination: { o: 2, short: 'Broad', statement: 'Federal law bars discrimination by race, sex, disability, age and sexual orientation / gender identity.', ev: 'law', cert: 'established', asOf: '2025', src: { org: 'Australian Human Rights Commission', url: 'https://humanrights.gov.au/' } },
      disability_rights: { o: 2, short: 'Strong', statement: 'Australia ratified the UN Convention on the Rights of Persons with Disabilities (CRPD) in 2008 and has a strong Disability Discrimination Act and the NDIS.', ev: 'law', cert: 'established', asOf: '2025', src: 'uncrpd' },
      abortion: { o: 3, short: 'On request', statement: 'Legal and available on request, with details varying slightly by state.', ev: 'law', cert: 'established', asOf: '2025', src: 'crr' },
      cannabis: { o: 1, short: 'Illegal (ACT differs)', statement: 'Illegal nationally; the ACT allows small personal amounts. Medical cannabis is legal by prescription.', ev: 'law', cert: 'established', asOf: '2025', src: { org: 'Wikipedia — Cannabis in Australia', url: 'https://en.wikipedia.org/wiki/Cannabis_in_Australia' } },
      religious_freedom: { o: 3, short: 'Low restrictions', statement: 'Pew rates government restrictions on religion as low.', ev: 'index', cert: 'established', asOf: '2022', src: 'pew' },
      blasphemy: { o: 2, short: 'No such laws', statement: 'No enforced blasphemy laws.', ev: 'law', cert: 'established', asOf: '2025', src: 'forb' },
      expression: { o: 2, short: 'Free · 94/100', statement: 'Rated Free, 94/100, by Freedom House (2025).', ev: 'index', cert: 'established', asOf: '2025', src: 'freedomhouse' },
      residence_registration: { required: false, timing: 'no separate registration', statement: 'No address registration; keep your student visa conditions and enrolment (CoE) current.', ev: 'law', cert: 'established', asOf: '2025', src: { org: 'Dept of Home Affairs', url: 'https://immi.homeaffairs.gov.au/' } },
      student_work: { required: false, timing: '≤48 hrs/fortnight in term', statement: 'The student visa allows up to 48 hrs/fortnight during term and unlimited hours in breaks.', ev: 'law', cert: 'established', asOf: '2025', src: { org: 'Dept of Home Affairs', url: 'https://immi.homeaffairs.gov.au/' } },
      health_insurance: { required: true, timing: 'for the whole stay', statement: 'Overseas Student Health Cover (OSHC) is mandatory for the student visa.', ev: 'law', cert: 'established', asOf: '2025', src: { org: 'Dept of Home Affairs', url: 'https://immi.homeaffairs.gov.au/' } },
      medication_import: { required: false, timing: 'declare on arrival', statement: 'Strict biosecurity — declare all medicines, food and plant products; carry prescriptions.', ev: 'advisory', cert: 'established', asOf: '2025', src: { org: 'Australian Border Force', url: 'https://www.abf.gov.au/' } },
    },
  },

  {
    code: 'UZ', name: 'Uzbekistan', flag: 'uz', region: 'Central Asia',
    emergency: { general: '112', police: '102', ambulance: '103', fire: '101' },
    claims: {
      same_sex: { o: 0, short: 'Criminalised', statement: 'Consensual sex between men is criminalised under the Criminal Code.', ev: 'law', cert: 'established', asOf: '2025', src: 'ilga' },
      gender_recognition: { o: 0, short: 'Not accessible', statement: 'There is no accessible legal gender-recognition process.', ev: 'law', cert: 'limited', asOf: '2025', src: 'equaldex' },
      antidiscrimination: { o: 1, short: 'Limited', statement: 'Formal anti-discrimination protection is limited.', ev: 'law', cert: 'limited', asOf: '2025', src: { org: 'Constitution of Uzbekistan, 2023', url: 'https://www.constituteproject.org/constitution/Uzbekistan_2023' } },
      disability_rights: { o: 1, short: 'CRPD + basic law', statement: 'Uzbekistan ratified the UN Convention on the Rights of Persons with Disabilities (CRPD) in 2021; accessibility remains limited.', ev: 'law', cert: 'established', asOf: '2025', src: 'uncrpd' },
      abortion: { o: 3, short: 'On request (≤12 wks)', statement: 'Available on request up to 12 weeks.', ev: 'law', cert: 'established', asOf: '2025', src: 'crr' },
      cannabis: { o: 1, short: 'Illegal', statement: 'Illegal; personal possession is prosecuted under Article 276 and can bring up to three years’ imprisonment.', ev: 'law', cert: 'established', asOf: '2025', src: { org: 'Wikipedia — Cannabis in Uzbekistan', url: 'https://en.wikipedia.org/wiki/Cannabis_in_Uzbekistan' } },
      religious_freedom: { o: 0, short: 'Very high restrictions', statement: 'Pew rates government restrictions on religion as very high; unregistered religious activity is restricted.', ev: 'index', cert: 'established', asOf: '2022', src: 'pew' },
      blasphemy: { o: 0, short: 'Actively enforced', statement: 'No apostasy law, but insulting religious feelings is an offence and unregistered religious activity, proselytising and materials are penalised.', ev: 'law', cert: 'established', asOf: '2025', src: 'forb' },
      expression: { o: 0, short: 'Not free · 12/100', statement: 'Rated Not Free, 12/100, by Freedom House (2025).', ev: 'index', cert: 'established', asOf: '2025', src: 'freedomhouse' },
      residence_registration: { required: true, deadlineDays: 3, timing: 'register within 3 working days', statement: 'Foreigners must register their place of stay within about three working days of arrival; hotels do this for you.', ev: 'law', cert: 'limited', asOf: '2025', src: { org: 'US State Dept — Uzbekistan', url: 'https://travel.state.gov/content/travel/en/international-travel/International-Travel-Country-Information-Pages/Uzbekistan.html' } },
      student_work: { required: false, timing: 'generally not permitted', statement: 'Student visas generally do not allow employment; work permits are separate and limited.', ev: 'law', cert: 'limited', asOf: '2025', src: { org: 'US State Dept — Uzbekistan', url: 'https://travel.state.gov/content/travel/en/international-travel/International-Travel-Country-Information-Pages/Uzbekistan.html' } },
      health_insurance: { required: true, timing: 'before travel', statement: 'Private health insurance is strongly advised; public healthcare is under-resourced.', ev: 'advisory', cert: 'limited', asOf: '2025', src: { org: 'US CDC — Uzbekistan travel health', url: 'https://wwwnc.cdc.gov/travel/destinations/traveler/none/uzbekistan' } },
      medication_import: { required: false, timing: 'declare and carry prescriptions', statement: 'Declare all medicines — some (codeine, strong psychotropics) are banned; keep prescriptions.', ev: 'advisory', cert: 'limited', asOf: '2025', src: { org: 'US State Dept — Uzbekistan', url: 'https://travel.state.gov/content/travel/en/international-travel/International-Travel-Country-Information-Pages/Uzbekistan.html' } },
    },
  },
]

export const JURISDICTION_BY_CODE = Object.fromEntries(JURISDICTIONS.map((j) => [j.code, j]))

export const JURISDICTION_OPTIONS = [...JURISDICTIONS]
  .sort((a, b) => a.name.localeCompare(b.name))
  .map((j) => ({ code: j.code, name: j.name, flag: j.flag }))
