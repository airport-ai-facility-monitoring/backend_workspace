
    create table alert.alert_table (
       alert_id numeric(19,0) identity not null,
        alert_date datetime,
        alert_log varchar(255),
        cctv_id numeric(19,0),
        primary key (alert_id)
    );

    create table alert.cctv_table (
       cctv_id numeric(19,0) identity not null,
        cctv_area varchar(255),
        cctv_url varchar(255),
        primary key (cctv_id)
    );

    create table alert.alert_table (
       alert_id numeric(19,0) identity not null,
        alert_date datetime,
        alert_log varchar(255),
        cctv_id numeric(19,0),
        primary key (alert_id)
    );

    create table alert.cctv_table (
       cctv_id numeric(19,0) identity not null,
        cctv_area varchar(255),
        cctv_url varchar(255),
        primary key (cctv_id)
    );

    create table equipmentanalysis.equipment_report_table (
       id numeric(19,0) identity not null,
        action VARCHAR(MAX),
        avg_life int,
        category varchar(255),
        cost VARCHAR(MAX),
        created_at datetime not null,
        decision VARCHAR(MAX),
        equipment_id numeric(19,0),
        failure int,
        labor_rate int,
        llm_report TEXT,
        maintenance_cost_num int,
        manufacturer varchar(255),
        name varchar(255),
        protection_rating varchar(255),
        purchase int,
        raw_json TEXT,
        repair_cost int,
        repair_time int,
        runtime int,
        service_years int,
        sub_category varchar(255),
        primary key (id)
    );

    create table equipmentdashboard.equipment_table (
       equipment_id numeric(19,0) identity not null,
        avg_life int,
        category varchar(255),
        equipment_name VARCHAR(255),
        equipment_type VARCHAR(255),
        failure int,
        labor_rate int,
        maintenance_cost int,
        manufacturer varchar(255),
        protection_rating varchar(255),
        purchase int,
        purchase_date datetime,
        repair_cost int,
        repair_time int,
        runtime int,
        service_years int,
        state varchar(255),
        lighting_detail_id numeric(19,0),
        sign_detail_id numeric(19,0),
        weather_detail_id numeric(19,0),
        primary key (equipment_id)
    );

    create table equipmentdashboard.lighting_equipment_detail (
       id numeric(19,0) identity not null,
        lamp_type varchar(255),
        power_consumption int,
        primary key (id)
    );

    create table equipmentdashboard.sign_equipment_detail (
       id numeric(19,0) identity not null,
        material varchar(255),
        mount_type varchar(255),
        panel_height int,
        panel_width int,
        sign_color varchar(255),
        primary key (id)
    );

    create table equipmentdashboard.weather_equipment_detail (
       id numeric(19,0) identity not null,
        mount_type varchar(255),
        power_consumption int,
        primary key (id)
    );

    alter table equipmentdashboard.equipment_table 
       add constraint FKk9j6xfiyfn7n2wpkp0c9ujpa6 
       foreign key (lighting_detail_id) 
       references equipmentdashboard.lighting_equipment_detail;

    alter table equipmentdashboard.equipment_table 
       add constraint FKr0opl1q4k02podtdrusyngo87 
       foreign key (sign_detail_id) 
       references equipmentdashboard.sign_equipment_detail;

    alter table equipmentdashboard.equipment_table 
       add constraint FKt2i83iyf6pe6dwr4rnejlbnt1 
       foreign key (weather_detail_id) 
       references equipmentdashboard.weather_equipment_detail;

    create table member.employee_table (
       employee_id numeric(19,0) not null,
        primary key (employee_id)
    );

    create table member.password_reset_token (
       id numeric(19,0) identity not null,
        attempts int,
        code varchar(6),
        created_at datetime,
        email varchar(150),
        expires_at datetime,
        used bit not null,
        user_id numeric(19,0),
        primary key (id)
    );

    create table member.user_table (
       id numeric(19,0) identity not null,
        department VARCHAR(100),
        email varchar(255) not null,
        employee_id numeric(19,0),
        failed_login_attempts int,
        hire_date datetime,
        name VARCHAR(100),
        password varchar(255),
        password_changed_at datetime,
        phone_number varchar(255),
        position VARCHAR(100),
        status varchar(255),
        primary key (id)
    );

    create table notification.notification_table (
       notifications_id numeric(19,0) not null,
        contents VARCHAR(MAX),
        file_url VARCHAR(MAX),
        important bit not null,
        original_filename VARCHAR(500),
        title VARCHAR(255),
        write_date datetime,
        writer_id numeric(19,0),
        primary key (notifications_id)
    );

    create table hibernate_sequence (
       next_val numeric(19,0)
    );

    insert into hibernate_sequence values ( 1 );

    create table runwaycrack.runway_crack_table (
       rc_id numeric(19,0) not null,
        area_cm2 double precision,
        avg_width_cm double precision,
        cctv_id numeric(19,0),
        detected_date datetime,
        epoxy_used bit,
        image_url varchar(255),
        joint_seal_used bit,
        length_cm double precision,
        pavement_type_concrete bit,
        polymer_used bit,
        rebar_used bit,
        repair_aream2 double precision,
        report_state bit,
        sealing_used bit,
        wiremesh_used bit,
        primary key (rc_id)
    );

    create table runwaycrack.runway_crack_report_table (
       rc_report_id numeric(19,0) identity not null,
        writing_date datetime,
        crack_id numeric(19,0),
        damage_info VARCHAR(1000),
        employee_id numeric(19,0),
        estimated_cost VARCHAR(500),
        estimated_period VARCHAR(500),
        repair_materials VARCHAR(500),
        summary VARCHAR(2000),
        title VARCHAR(500),
        primary key (rc_report_id)
    );

    alter table runwaycrack.runway_crack_table 
       add constraint UK_2oasaiiuqsldu1et07cggubus unique (cctv_id);

    alter table runwaycrack.runway_crack_report_table 
       add constraint UK_7pcv2tcjfgyic608qseotklnm unique (crack_id);

    create table hibernate_sequence (
       next_val numeric(19,0)
    );

    insert into hibernate_sequence values ( 1 );

    create table runwayobject.strange_object_table (
       obj_id numeric(19,0) not null,
        cctv_id numeric(19,0),
        image_url varchar(255),
        object_type int,
        primary key (obj_id)
    );

    create table runwayobject.worker_table (
       worker_id numeric(19,0) not null,
        approval_worker_count int,
        work_area varchar(255),
        work_end_time datetime,
        work_start_time datetime,
        primary key (worker_id)
    );

    create table runwayobject.work_truck_table (
       work_truck_id numeric(19,0) not null,
        work_end_time datetime,
        work_start_time datetime,
        work_truck_type int,
        primary key (work_truck_id)
    );

    create table hibernate_sequence (
       next_val numeric(19,0)
    );

    insert into hibernate_sequence values ( 1 );

    create table runwayobject.strange_object_table (
       obj_id numeric(19,0) not null,
        cctv_id numeric(19,0),
        image_url varchar(255),
        object_type int,
        primary key (obj_id)
    );

    create table runwayobject.worker_table (
       worker_id numeric(19,0) not null,
        approval_worker_count int,
        work_area varchar(255),
        work_end_time datetime,
        work_start_time datetime,
        primary key (worker_id)
    );

    create table runwayobject.work_truck_table (
       work_truck_id numeric(19,0) not null,
        work_end_time datetime,
        work_start_time datetime,
        work_truck_type int,
        primary key (work_truck_id)
    );

    create table hibernate_sequence (
       next_val numeric(19,0)
    );

    insert into hibernate_sequence values ( 1 );
