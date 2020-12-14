/*
 Creator and initializer of 'conchiglie' database
 */

create database conchiglie;

use conchiglie;

create table genere
(
    nome varchar(50) not null,
    id   int unsigned auto_increment
        primary key,
    constraint nome
        unique (nome)
);

create table famiglia
(
    nome      varchar(50)  not null,
    codice    varchar(2)   not null,
    genere_id int unsigned not null,
    id        int unsigned auto_increment
        primary key,
    constraint codice
        unique (codice),
    constraint nome
        unique (nome),
    constraint famiglia_ibfk_1
        foreign key (genere_id) references genere (id)
);

create index genere_id
    on famiglia (genere_id);

create table specie
(
    nome        varchar(255) not null,
    famiglia_id int unsigned not null,
    id          int unsigned auto_increment
        primary key,
    ritrovatore       varchar(50)  not null,
    anno_ritrovamento int unsigned not null,
    constraint nome
        unique (nome),
    constraint specie_ibfk_1
        foreign key (famiglia_id) references famiglia (id)
);

create table esemplare
(
    id                      int unsigned auto_increment
        primary key,
    data_ritrovamento       date                   not null,
    luogo_ritrovamento      varchar(50)            not null,
    stato_ritrovamento      enum ('vivo', 'morto') not null,
    condizioni_ritrovamento text                   null,
    note                    text                   null,
    foto                    mediumblob             null,
    specie_id               int unsigned           not null,
    constraint esemplare_ibfk_1
        foreign key (specie_id) references specie (id)
);

create index specie_id
    on esemplare (specie_id);

create index famiglia_id
    on specie (famiglia_id);


