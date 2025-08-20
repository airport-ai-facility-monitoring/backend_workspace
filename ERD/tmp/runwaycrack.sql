
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
