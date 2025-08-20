
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
