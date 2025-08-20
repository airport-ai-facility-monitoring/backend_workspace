
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
