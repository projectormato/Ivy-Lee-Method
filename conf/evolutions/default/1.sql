# --- First database schema

# --- !Ups
create table todo (
  id                        serial,
  name                      varchar(255) not null,
  todo_type                 bigint not null,
  primary key (id)
);

insert into todo (name,todo_type) values ('ToDo', 1);

# --- !Downs
drop table if exists todo;

