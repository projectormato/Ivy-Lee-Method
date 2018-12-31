# --- First database schema

# --- !Ups
create table todo (
--   id                        bigint not null auto_increment,
  id                        serial,
  name                      varchar(255) not null,
  todo_type                 bigint not null,
  primary key (id)
--   constraint pk_todo primary key (id)
  );
-- create sequence todo_seq start with 2;

-- insert into todo (id,name,todo_type) values (1,'ToDo', 1);
insert into todo (name,todo_type) values ('ToDo', 1);

# --- !Downs
drop table if exists todo;

-- drop sequence if exists todo_seq;