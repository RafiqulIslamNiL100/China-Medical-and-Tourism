-- Seed reference data: The First Affiliated Hospital of Xi'an Jiaotong University
-- (FAH-XJTU), the Xi'an city, and the 38 specialties it treats. Idempotent via
-- ON CONFLICT DO NOTHING so re-deploys and any pre-existing rows are safe. The
-- large rich profile is dollar-quoted ($md$) so its apostrophes/pipes need no escaping.

-- City ----------------------------------------------------------------------
INSERT INTO "City" ("slug", "name", "tagline", "climate") VALUES
  ('xi-an', $t$Xi'an$t$, $t$Home to the Terracotta Army and Shaanxi's leading academic medical centers.$t$, 'Temperate continental — cold, dry winters and hot summers.')
ON CONFLICT ("slug") DO NOTHING;

-- Specialties ---------------------------------------------------------------
INSERT INTO "Specialty" ("slug", "name", "blurb") VALUES
  ('cardiology', 'Cardiology', NULL),
  ('oncology', 'Oncology', NULL),
  ('orthopedics', 'Orthopedics', NULL),
  ('fertility', 'Fertility & IVF', NULL),
  ('tcm-wellness', 'TCM Wellness', NULL),
  ('endocrinology', 'Endocrinology & Metabolism', NULL),
  ('gastroenterology', 'Gastroenterology', NULL),
  ('pediatrics', 'Pediatrics', NULL),
  ('obstetrics-gynecology', 'Obstetrics & Gynecology', NULL),
  ('urology', 'Urology', NULL),
  ('neurology', 'Neurology', NULL),
  ('respiratory-medicine', 'Respiratory & Critical Care Medicine', NULL),
  ('psychiatry', 'Psychiatry', NULL),
  ('ent', 'Otolaryngology — Head & Neck Surgery (ENT)', NULL),
  ('breast-surgery', 'Breast Surgery', NULL),
  ('rheumatology', 'Rheumatology & Immunology', NULL),
  ('kidney-transplantation', 'Kidney Transplantation', NULL),
  ('nephrology', 'Nephrology', NULL),
  ('hepatobiliary-surgery', 'Hepatobiliary Surgery', NULL),
  ('hematology', 'Hematology', NULL),
  ('pain-management', 'Pain Management', NULL),
  ('peripheral-vascular-medicine', 'Peripheral Vascular Medicine', NULL),
  ('vascular-surgery', 'Vascular Surgery', NULL),
  ('thoracic-surgery', 'Thoracic Surgery', NULL),
  ('general-surgery', 'General Surgery', NULL),
  ('infectious-diseases', 'Infectious Diseases', NULL),
  ('dermatology', 'Dermatology & Venereology', NULL),
  ('geriatric-cardiology', 'Geriatric Cardiology', NULL),
  ('cardiovascular-surgery', 'Cardiovascular Surgery', NULL),
  ('radiation-oncology', 'Radiation Oncology', NULL),
  ('plastic-surgery', 'Plastic & Maxillofacial Surgery', NULL),
  ('rehabilitation-medicine', 'Rehabilitation Medicine', NULL),
  ('genetics', 'Genetics & Eugenics', NULL),
  ('ophthalmology', 'Ophthalmology', NULL),
  ('stomatology', 'Stomatology', NULL),
  ('neurosurgery', 'Neurosurgery', NULL),
  ('critical-care', 'Critical Care Medicine', NULL),
  ('organ-transplantation', 'Organ Transplantation', NULL)
ON CONFLICT ("slug") DO NOTHING;

-- Hospital ------------------------------------------------------------------
INSERT INTO "Hospital" (
  "id", "slug", "name", "citySlug", "description", "richProfileMarkdown", "priceTier",
  "specialtySlugs", "accreditations", "languages", "facilities", "rating", "reviewCount", "status", "createdAt", "updatedAt"
) VALUES (
  gen_random_uuid()::text,
  'first-affiliated-hospital-xjtu',
  $t$The First Affiliated Hospital of Xi'an Jiaotong University$t$,
  'xi-an',
  $t$A large, comprehensive Class A Tertiary Hospital under China's National Health Commission, founded in 1937. Its International Treatment Department (established 2017) provides hotel-style inpatient care, 24-hour emergency response, and smart IoT-enabled wards for patients from 30+ countries.$t$,
  $md$## Hospital Overview

The First Affiliated Hospital of Xi'an Jiaotong University (FAH-XJTU) is a large, comprehensive Class A Tertiary Hospital under the administration of the National Health Commission of China. Founded in 1937, it integrates medical care, teaching, scientific research, rehabilitation, and preventive healthcare.

The hospital has been shortlisted as one of the first batch of "counseling units" for the establishment of national medical centers in China. It follows a "one hospital, multiple divisions" development strategy, comprising three hospitals (Main Division in Yanta District, Land Port Division in Chanba International Port, and East Division in Yanliang District) and four divisions (Xingshan Temple, South, Administration, and MED-X Research Institute).

- **Planned Ward Beds:** 3,765
- **Staff:** Over 7,500, including 903 senior professionals and 129 top-tier talents
- **Clinical Departments:** 58 clinical and medical technology departments in total (48 clinical departments, 10 medical technology departments)
- **Official Website:** [www.en.jdyfy.com](https://www.en.jdyfy.com)
- **International Treatment Department Address:** 5th Floor, Southwest Side, Outpatient Building
- **Contact Number:** +86-29-85323112

## International Treatment Department

The International Patient Ward was established in July 2017 as a key high-end medical service platform for international patients and special medical services.

**Key Features:**

- 13 open beds (11 single rooms and 2 suites) with hotel-style services
- 1,000+ discharged patients annually and over 12,000 outpatient visits annually
- 24-hour special medical emergency response mechanism
- Smart ward system with IoT, big data, AI, and telemedicine integration:
  - Contactless real-time monitoring of vital signs
  - SOS one-touch alarm smart wristbands
  - Smart infusion system and pneumatic logistics transmission system
- Multidisciplinary consultations (MDT) organized regularly
- International patients from the United States, Canada, the United Kingdom, France, Japan, Russia, Italy, South Korea, Nigeria, Brazil, Belt and Road countries, and Hong Kong, Macao, and Taiwan regions
- VIP medical support for major events: China-Central Asia Summit (2023), Shanghai Cooperation Organization Health Ministers' Meeting (2025)

**Scope of Diagnosis & Treatment:**

The International Treatment Department covers full-cycle health management for chronic internal medicine diseases, including:

- Cardiovascular diseases
- Endocrine and metabolic diseases
- Respiratory diseases
- Digestive diseases
- Renal diseases
- Preoperative assessment and postoperative rehabilitation for surgical patients
- Inpatient healthcare and follow-up after discharge
- Medical support during tumor radiotherapy and chemotherapy

**Specialized Departments Covered by International Treatment Department:**

The department brings together the hospital's leading expert teams across nearly 40 clinical specialties, with over 130 renowned specialists, including: Cardiovascular Medicine, Endocrinology and Metabolism, Gastroenterology, Pediatrics, Obstetrics and Gynecology, Urology, Neurology, Respiratory Medicine, Psychiatry, Otolaryngology-Head and Neck Surgery, Breast Surgery, Rheumatology and Immunology, Orthopedics, Kidney Transplantation, Nephrology, Hepatobiliary Surgery, Hematology, Pain Management, Peripheral Vascular Medicine, Traditional Chinese Medicine, Thoracic Surgery, General Surgery, Infectious Diseases, Surgical Oncology, Dermatology and Venereology, Vascular Surgery, Medical Oncology, Geriatric Cardiology, Cardiovascular Surgery, Radiation Oncology, Plastic and Maxillofacial Surgery, Rehabilitation Medicine, Genetics and Eugenics, Ophthalmology, Stomatology, Reproductive Medicine, and Neurosurgery.

## National Key Disciplines & Key Specialty Construction Programs

| Level | Department |
|---|---|
| National Key Discipline (Ministry of Education) | Department of Surgery (Urology) / Kidney Transplantation |
| National Key Cultivation Discipline (Ministry of Education) | Dermatology and Venereology |
| National Clinical Key Specialty Construction Programs | 26 programs including: Obstetrics, Critical Care Medicine, Cardiovascular Medicine, General Surgery, Urology, Respiratory Medicine, Nephrology, Oncology, Medical Imaging, Infectious Diseases, Orthopedics, Laboratory Medicine, Organ Transplantation, Geriatrics, and more |
| National Regional Medical Center Applicants (Shaanxi Province) | 9 specialty categories: Neurological Diseases, Cardiovascular Diseases, Infectious Diseases, Obstetrics and Gynecology, Cancer, Mental Health, Endocrine and Metabolic Diseases, Critical Care, Hematologic Diseases |
| Provincial Level | 10 clinical key specialty construction projects, 5 key medical disciplines, 7 advantageous disciplines, 1 key TCM specialty |
| Shaanxi Provincial Medical Quality Control Centers | 16 centers |

## Complete Department Directory

### I. Internal Medicine

| Department Name | Specialties & Advantages |
|---|---|
| Department of Cardiovascular Medicine | National Clinical Key Specialty. Specializes in minimally invasive heart surgeries, valvular heart disease, coronary artery disease, and heart failure. Key Laboratory of Shaanxi Province. |
| Department of Neurology | National Clinical Key Specialty. Leading in cerebrovascular disease thrombolysis, Parkinson's disease, dementia, cognitive disorders, and epilepsy in Northwest China. |
| Department of Gastroenterology | Specializes in early gastrointestinal cancer ESD, endoscopic ultrasound (EUS), and ERCP for biliary and pancreatic diseases. |
| Department of Respiratory and Critical Care Medicine | National Clinical Key Specialty Construction Program. Founded in 1976. Specializes in asthma, pulmonary embolism, and pulmonary infectious diseases. |
| Department of Endocrinology and Metabolism | National Clinical Key Specialty. Over 150,000 outpatient visits annually. Specializes in diabetes, thyroid diseases, and metabolic disorders. |
| Department of Nephrology | National Clinical Key Specialty. The earliest and most powerful nephrology specialty in Northwest China, integrating medicine, education, and research. |
| Department of Hematology | Shaanxi Provincial Advantageous Medical Specialty. Hematopoietic stem cell transplantation ranks first in Northwest China. |
| Department of Rheumatology and Immunology | Specializes in rheumatoid arthritis, systemic lupus erythematosus, and other autoimmune diseases. |
| Department of Geriatrics | National Clinical Key Specialty. Founded in 1956. The largest geriatrics department in Shaanxi Province. |
| Department of Infectious Diseases | National Key Cultivation Discipline. Authored China's first guidelines for prevention of mother-to-child transmission of hepatitis B virus. |
| Department of Medical Oncology | National Clinical Key Specialty. Specializes in chemotherapy, targeted therapy, immunotherapy, and comprehensive cancer treatment. |
| Department of Psychiatry | Originated from China's first psychological consultation outpatient clinic in a tertiary hospital (established in 1980). Specializes in depression, anxiety, and sleep disorders. |
| Department of Dermatology and Venereology | National Key Cultivation Discipline (Ministry of Education). Specializes in vitiligo, psoriasis, and severe acne. |
| Department of Traditional Chinese Medicine (TCM) | Established in 1958. Comprehensive department integrating medical treatment, teaching, research, nursing, and health protection. Specializes in geriatrics, oncology, nephrology, and spleen-stomach diseases with integrated TCM and Western medicine. |
| Department of Rehabilitation Medicine | Specializes in neurological rehabilitation, orthopedic rehabilitation, and pain management with integrated Chinese and Western medicine. |
| Department of Pain Management | Specializes in chronic pain and neuropathic pain with minimally invasive interventional treatments. |
| Department of Nutrition | Provides clinical nutrition support and dietary guidance. |
| Department of Nuclear Medicine | Specializes in SPECT/CT, PET/CT molecular functional imaging; radioactive iodine-131 therapy for hyperthyroidism and differentiated thyroid cancer; tumor molecular targeted functional imaging. |

### II. Surgery

| Department Name | Specialties & Advantages |
|---|---|
| Department of Urology / Kidney Transplantation | National Key Discipline (Ministry of Education). Over 8,100+ kidney transplants performed, ranking among the top in China. |
| Department of Hepatobiliary Surgery | Shaanxi Provincial Advantageous Medical Specialty. Over 1,800+ liver transplants performed. Performed China's first IVF donor liver transplant. |
| Department of General Surgery | National Clinical Key Specialty Construction Program. Founded in 1956. Specializes in gastrointestinal, thyroid, and breast surgeries. One of China's first master's degree authorization units. |
| Department of Vascular Surgery | National Clinical Key Specialty. Specializes in aortic dissection covered stent endovascular exclusion and other vascular diseases. |
| Department of Peripheral Vascular Medicine | Specializes in interventional and surgical treatment of peripheral vascular diseases. |
| Department of Neurosurgery | Specializes in intracranial tumors, cerebrovascular diseases, and functional neurosurgery. |
| Department of Thoracic Surgery | Shaanxi Provincial Clinical Key Specialty. One of China's earliest centers for lung cancer and esophageal cancer radical surgery. Covers 6 subspecialties including lung transplant surgery. |
| Department of Cardiovascular Surgery | Performed multiple national "first cases" of complex composite minimally invasive heart surgeries, including minimally invasive multi-valve replacement and Bentall procedure. |
| Department of Orthopedics | National Clinical Key Specialty Construction Program. Subspecialties include: Trauma Orthopedics (minimally invasive fracture surgery), Spine Surgery, Sports Medicine & Joint Surgery, Orthopedic Oncology. |
| Department of Breast Surgery | Specializes in diagnosis and surgical treatment of benign and malignant breast tumors. |
| Department of Plastic and Maxillofacial Surgery | Specializes in facial plastic surgery and maxillofacial trauma repair. |
| Discipline of Organ Transplantation | National Clinical Key Specialty and Shaanxi Provincial Quality Control Center for Organ Transplantation. Holds qualifications for all major organ transplants: kidney, liver, heart, lung, pancreas, and small intestine. |

### III. Obstetrics, Gynecology & Pediatrics

| Department Name | Specialties & Advantages |
|---|---|
| Department of Obstetrics and Gynecology | Founded in 1956. Obstetrics is a National Clinical Key Specialty. Strong technical force with complete functions and equipment. Subspecialties: Perinatal Medicine, Gynecology, Reproductive Endocrinology. |
| Department of Reproductive Medicine | Specializes in infertility and assisted reproductive technology (IVF). |
| Department of Genetics and Eugenics | Provides genetic counseling and prenatal diagnosis services. |
| Department of Pediatrics | Subspecialties: Pediatric Internal Medicine, Pediatric Surgery, Neonatology, Pediatric Intensive Care, Child Health. 24-hour outpatient and emergency services. |
| Department of Neonatology | Specializes in neonatal disease diagnosis and intensive care. |
| Department of Child Health | Provides child growth and development monitoring and health guidance. |

### IV. ENT, Ophthalmology & Stomatology

| Department Name | Specialties & Advantages |
|---|---|
| Department of Otolaryngology-Head and Neck Surgery | Shaanxi Provincial Clinical Key Specialty. Specializes in surgical treatment of ENT and head and neck tumors. |
| Department of Ophthalmology | Specializes in cataract, glaucoma, and fundus diseases. |
| Department of Stomatology | Provides oral medicine, oral surgery, and prosthodontics services. |

### V. Oncology

| Department Name | Specialties & Advantages |
|---|---|
| Department of Medical Oncology | National Clinical Key Specialty. Chemotherapy, targeted therapy, immunotherapy, comprehensive cancer treatment. |
| Department of Surgical Oncology | Shaanxi Provincial Key Construction Discipline. Specializes in surgical treatment of lung cancer, gastrointestinal cancer, and breast cancer. |
| Department of Radiation Oncology | Provides precision radiotherapy services. |
| Department of Breast Surgery | Specializes in diagnosis and surgical treatment of breast tumors. |

### VI. Emergency & Critical Care

| Department Name | Specialties & Advantages |
|---|---|
| Department of Emergency Medicine | 24-hour emergency services at Land Port Division. Subspecialties: Emergency Internal Medicine, Emergency Surgery, Emergency Intensive Care Unit (EICU). |
| Department of Critical Care Medicine (ICU) | National Clinical Key Specialty. Founded in 2005. Began with 9 beds, expanded to 19 in 2007. |

### VII. Medical Technology Departments

| Department Name | Specialties & Advantages |
|---|---|
| Department of Medical Imaging | National Clinical Key Specialty Construction Program. Equipped with CT, MRI, and advanced imaging equipment. |
| Department of Ultrasound Medicine | National Key Discipline (Ministry of Education). National Clinical Key Specialty. Shaanxi Provincial Standardized Training Base for Ultrasound Residents. |
| Department of Nuclear Medicine | Provides radionuclide imaging and therapy services. |
| Department of Pathology | Provides clinical pathological diagnosis services. |
| Department of Laboratory Medicine | National Clinical Key Specialty Construction Program. |
| Department of Blood Transfusion | Provides clinical blood supply services. |
| Department of Pharmacy | Provides clinical pharmaceutical services and rational drug use guidance. |
| Department of Anesthesiology | Equipped with smart operating rooms, provides anesthesia support for complex surgeries. |
| Department of Blood Purification | Provides hemodialysis, hemofiltration, and other renal replacement therapies. |
| Department of Central Sterile Supply | Provides medical instrument sterilization and disinfection services. |

## Core Technologies & Advantages

| Technology Area | Core Advantages |
|---|---|
| Organ Transplantation | Qualifications for all major organ transplants: kidney, liver, heart, lung, pancreas, and small intestine. Over 8,100+ kidney transplants and 1,800+ liver transplants performed. |
| Cardiovascular & Cerebrovascular Diseases | World's first "fully biodegradable" cardiac stent; national project for enhancing capacity to diagnose and treat complex cardiovascular and cerebrovascular diseases. |
| Medical-Engineering Integration | Actively explores 17 innovative technologies across five major categories: magnetic compression, magnetic anchoring, magnetic navigation, magnetic levitation, and magnetic tracing. |
| Minimally Invasive Surgery | Leading in endoscopic, laparoscopic, and robotic-assisted minimally invasive surgeries across multiple specialties. |
| Cancer Treatment | Comprehensive cancer care: surgical oncology, medical oncology (chemo/targeted/immunotherapy), and radiation oncology. Key Laboratory for Tumor Precision Medicine in Shaanxi Province. |
| Stem Cell & Regenerative Medicine | Shaanxi Provincial Regenerative Medicine and Surgical Engineering Research Center. |
| Immunotherapy | Shaanxi Provincial Antibody and Cellular Immunotherapy Engineering Research Center. |
$md$,
  '$$$',
  ARRAY['cardiology','oncology','orthopedics','fertility','tcm-wellness','endocrinology','gastroenterology','pediatrics','obstetrics-gynecology','urology','neurology','respiratory-medicine','psychiatry','ent','breast-surgery','rheumatology','kidney-transplantation','nephrology','hepatobiliary-surgery','hematology','pain-management','peripheral-vascular-medicine','vascular-surgery','thoracic-surgery','general-surgery','infectious-diseases','dermatology','geriatric-cardiology','cardiovascular-surgery','radiation-oncology','plastic-surgery','rehabilitation-medicine','genetics','ophthalmology','stomatology','neurosurgery','critical-care','organ-transplantation']::text[],
  ARRAY['Class A Tertiary Hospital','National Health Commission Affiliated']::text[],
  ARRAY['English','Mandarin','Russian']::text[],
  ARRAY['24-hour international emergency response','Hotel-style single rooms and suites','Smart IoT-enabled wards','Multidisciplinary consultation (MDT) team','On-site interpretation services']::text[],
  0,
  0,
  'Published',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT ("slug") DO NOTHING;
