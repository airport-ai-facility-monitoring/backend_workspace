
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
