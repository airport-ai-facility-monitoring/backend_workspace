
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
