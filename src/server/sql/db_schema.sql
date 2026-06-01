DROP SCHEMA IF EXISTS ob CASCADE;
CREATE SCHEMA ob;


--------------- BEGIN SYSTEM LOGIN ---------------
DROP TABLE IF EXISTS ob.user;
CREATE TABLE ob.user (
	user_id SERIAL PRIMARY KEY,
	uname VARCHAR(50),
	pword VARCHAR(50),
	last_name VARCHAR(50),
	first_name VARCHAR(50),
	user_type_id INTEGER,
	last_edit_user VARCHAR(50) DEFAULT 'admin',
	last_edit_date TIMESTAMP DEFAULT NOW()
);
DROP INDEX IF EXISTS u_user_type_id_idx;
CREATE INDEX u_user_type_id_idx ON ob.user (user_type_id);
--------------- END SYSTEM LOGIN ---------------


--------------- BEGIN DASHBOARD ---------------
/* Patien Info */
DROP TABLE IF EXISTS ob.patient;
CREATE TABLE ob.patient (
	patient_id SERIAL PRIMARY KEY,
	patient_name VARCHAR(100),
	address VARCHAR(100),
	birth_date DATE,
	contact_no VARCHAR(50),
	cs VARCHAR(100),
	philhealth VARCHAR(100),
	hmo VARCHAR(100),
	is_deleted BOOLEAN DEFAULT FALSE,
	registered_date DATE DEFAULT now(),
	last_edit_user VARCHAR(50) DEFAULT 'admin',
	last_edit_date TIMESTAMP DEFAULT NOW()
);


/* Patient schedule and status */
DROP TABLE IF EXISTS ob.schedule_checkup;
CREATE TABLE ob.schedule_checkup (
	schedule_checkup_id SERIAL PRIMARY KEY,
	patient_id INTEGER REFERENCES ob.patient (patient_id),
	status_id INTEGER,
	arrived_date TIMESTAMP DEFAULT NOW(),
	in_dashboard BOOLEAN DEFAULT TRUE,
	last_edit_user VARCHAR(50) DEFAULT 'admin',
	last_edit_date TIMESTAMP DEFAULT NOW()
);

--insert dummy records -- insert into ob.schedule_checkup(patient_id,status_id) values(3,4),(4,4),(5,4),(6,4),(7,4),(8,4);
DROP INDEX IF EXISTS sc_status_id_idx;
CREATE INDEX sc_status_id_idx ON ob.schedule_checkup (status_id);


/* Medicine inventory */
DROP TABLE IF EXISTS ob.medicine;
CREATE TABLE ob.medicine (
	medicine_id SERIAL PRIMARY KEY,
	name VARCHAR(50),
	mg INT,
	qty INT,
	unit_price DECIMAL,
	description TEXT,
	is_deleted BOOLEAN DEFAULT false,
	last_edit_user VARCHAR(50) DEFAULT 'admin',
	last_edit_date TIMESTAMP DEFAULT NOW()
);


-- List of purchased medicine in patient schedule
DROP TABLE IF EXISTS ob.purchased_medicine;
--insert into ob.purchased_medicine(medicine_id,schedule_checkup_id,qty) values(1,1,20),(2,2,20);
CREATE TABLE ob.purchased_medicine (
	purchased_medicine_id SERIAL PRIMARY KEY,
	schedule_checkup_id INTEGER REFERENCES ob.schedule_checkup (schedule_checkup_id),
	medicine_id INTEGER REFERENCES ob.medicine (medicine_id),
	qty INTEGER,
	last_edit_user VARCHAR(50) DEFAULT 'admin',
	last_edit_date TIMESTAMP DEFAULT NOW()
);
DROP INDEX IF EXISTS pm_schedule_id_idx;
CREATE INDEX pm_schedule_checkup_id_idx ON ob.purchased_medicine (schedule_checkup_id);
DROP INDEX IF EXISTS pm_medicine_id_idx;
CREATE INDEX pm_medicine_id_idx ON ob.purchased_medicine (medicine_id);
--------------- END DASHBOARD ---------------



--------------- BEGIN PATIENT PAGE ---------------
-- dummy records -- insert into ob.patient_medical_history (patient_id,lmp)values(1,'2018-05-10'::date),(2,'2018-05-11'::date),(3,'2018-05-12'::date),(4,'2018-05-113'::date);
/* Past Medical History of patient */
DROP TABLE IF EXISTS ob.patient_medical_history;
CREATE TABLE ob.patient_medical_history (
	patient_medical_history_id SERIAL PRIMARY KEY,
	patient_id INTEGER REFERENCES ob.patient (patient_id),
	remarks TEXT,
	allergies TEXT,
	asthma TEXT,
	dm BOOLEAN,
	dm_remarks TEXT,
	hpn BOOLEAN,
	hpn_remarks TEXT,
	others_remarks TEXT,

	/* to move in
	ob_score VARCHAR(50),
	lmp DATE,
	aog_weeks VARCHAR(3),
	aog_days VARCHAR(3),
	*/


	/* MH/SH History */
	mh_menarche TEXT,
	mh_interval TEXT,
	mh_duration TEXT,
	mh_ammount TEXT,
	mh_symptoms TEXT,
	sh_coitarche TEXT,
	sh_nop TEXT,
	sh_std TEXT,
	sh_vaccination TEXT,
	sh_others TEXT,
	
	last_edit_user VARCHAR(50) DEFAULT 'admin',
	last_edit_date TIMESTAMP DEFAULT NOW()
);


/* Patient Delivery History */
DROP TABLE IF EXISTS ob.patient_delivery_history;
CREATE TABLE ob.patient_delivery (
	patient_delivery_history_id SERIAL PRIMARY KEY,
	patient_id INTEGER REFERENCES ob.patient (patient_id),
	year VARCHAR(20),
	mode_of_delivery VARCHAR(50),
	place_of_delivery VARCHAR(200),
	attendant TEXT,
	complications TEXT,
	sort_id INT,
	last_edit_user VARCHAR(50) DEFAULT 'admin',
	last_edit_date TIMESTAMP DEFAULT NOW()
);
--------------- END PATIENT PAGE ---------------



--------------- BEGIN HISTORICAL MODAL ---------------
DROP TABLE IF EXISTS ob.sc_checkup_history;
CREATE TABLE ob.sc_checkup_history (
	sc_checkup_history_id SERIAL PRIMARY KEY,
	schedule_checkup_id INTEGER REFERENCES ob.schedule_checkup (schedule_checkup_id),

	checkup_type_id INTEGER,

	/* MH/SH History */
	/* move fields to patient_medical_history
	mh_menarche TEXT,
	mh_interval TEXT,
	mh_duration TEXT,
	mh_ammount TEXT,
	mh_symptoms TEXT,
	sh_coitarche TEXT,
	sh_nop TEXT,
	sh_std TEXT,
	sh_vaccination TEXT,
	sh_others TEXT,
	*/

	/* Previous fields in ob.patient_medical_history */
	ob_score VARCHAR(50),
	lmp DATE,
	aog_weeks VARCHAR(3),
	aog_days VARCHAR(3),

	/* AOG */
	aog_date DATE,
	aog_by_lmp TEXT,
	aog_by_utz TEXT,
	aog_remarks TEXT,

	/* additional fields */
	extra_ob_score VARCHAR(50),
	extra_lmp DATE,
	

	/* Vitalsigns */
	weight VARCHAR(10),
	bp VARCHAR(10),
	cr VARCHAR(10),
	temp VARCHAR(10),
	remarks text,

	delivered BOOLEAN DEFAULT false,

	last_edit_user VARCHAR(50) DEFAULT 'admin',
	last_edit_date TIMESTAMP DEFAULT NOW()
);
DROP INDEX IF EXISTS sch_checkup_type_id_idx;
CREATE INDEX sch_checkup_type_id_idx ON ob.sc_checkup_history (checkup_type_id);


/* SOAP */
DROP TABLE IF EXISTS ob.sc_soap;
CREATE TABLE ob.sc_soap (
	sc_soap_id SERIAL PRIMARY KEY,
	schedule_checkup_id INTEGER REFERENCES ob.schedule_checkup (schedule_checkup_id),
	s_nausea_vomiting BOOLEAN,
	s_nausea_vomiting_remarks TEXT,
	s_hypogastric_pain BOOLEAN,
	s_hypogastric_pain_remarks TEXT,
	s_uterine_contractions BOOLEAN,
	s_uterine_contractions_remarks TEXT,
	s_bleeding BOOLEAN,
	s_bleeding_remarks TEXT,
	s_fetal_movement BOOLEAN,
	s_fetal_movement_remarks TEXT,
	s_others TEXT,

	s_what TEXT,
	s_duration TEXT,
	s_intervention TEXT,

	o_fundic_height TEXT,
	o_fundic_height_remarks TEXT,
	o_fetal_heart_beat TEXT,
	o_fetal_heart_beat_remarks TEXT,
	o_others TEXT,
	o_others_remarks TEXT,

	o_abdomen TEXT,
	o_ie TEXT,
	o_se TEXT,
	o_breast TEXT,


	a_diagnosis TEXT,

	p_utz TEXT,
	p_blood TEXT,
	p_urine TEXT,
	p_others TEXT,
	p_vaccine_remarks TEXT,
	p_monitoring_remarks TEXT,
	last_edit_user VARCHAR(50) DEFAULT 'admin',
	last_edit_date TIMESTAMP DEFAULT NOW()
);

DROP TABLE IF EXISTS ob.sc_prescribed_medicine;
CREATE TABLE ob.sc_prescribed_medicine (
	sc_prescribed_medicine_id SERIAL PRIMARY KEY,
	schedule_checkup_id INTEGER REFERENCES ob.schedule_checkup (schedule_checkup_id),
	med_name TEXT,
	med_qty INTEGER,
	frequency VARCHAR(100),
	last_edit_user VARCHAR(50) DEFAULT 'admin',
	last_edit_date TIMESTAMP DEFAULT NOW()
);

DROP TABLE IF EXISTS ob.patient_test_results;
CREATE TABLE ob.patient_test_results (
	patient_test_results_id SERIAL PRIMARY KEY,
	patient_id INTEGER REFERENCES ob.patient (patient_id),
	test_type TEXT,
	file_path TEXT,
	google_id TEXT,
	last_edit_user VARCHAR(50) DEFAULT 'admin',
	last_edit_date TIMESTAMP DEFAULT NOW()
);
--------------- END HISTORICAL MODAL ---------------



--------------- START LOOKUP ---------------
DROP TABLE IF EXISTS ob.look_up;
CREATE TABLE ob.look_up (
	look_up_id SERIAL PRIMARY KEY,
	value VARCHAR(50),
	look_up_type VARCHAR (50),
	sequence_id INT,
	active BOOLEAN DEFAULT true,
	last_edit_user VARCHAR(50) DEFAULT 'admin',
	last_edit_date TIMESTAMP DEFAULT NOW()
);
DROP INDEX IF EXISTS lu_look_up_type_idx;
CREATE INDEX lu_look_up_type_idx ON ob.look_up (look_up_type);
DROP INDEX IF EXISTS lu_look_up_type_value_idx;
CREATE INDEX lu_look_up_type_value_idx ON ob.look_up (look_up_type, value);


/* Add the lookups */
INSERT INTO ob.look_up (value, look_up_type)
VALUES
('systemAdmin', 'userType'),
('userAdmin', 'userType'),
('secretary', 'userType'),
('In Progress','scheduleStatus'),
('Completed','scheduleStatus'),
('Obstertics','checkupType'),
('Gynecology','checkupType'),
('Waiting','scheduleStatus');


/* Add admin user */
INSERT INTO ob.user (uname, pword, last_name, first_name, user_type_id)
VALUES
(	
	'admin',
	'pass1234',
	'admin',
	'user', 
	(SELECT look_up_id FROM ob.look_up WHERE value = 'systemAdmin')
);
--------------- END LOOKUP ---------------


