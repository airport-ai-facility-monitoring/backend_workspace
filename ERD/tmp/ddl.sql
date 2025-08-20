
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
