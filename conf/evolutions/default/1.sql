# --- First database schema

# --- !Ups
create table todo (
  id                        bigint not null auto_increment,
  name                      varchar(255) not null,
  todo_type                 int not null
  constraint pk_todo primary key (id))
;
create sequence todo_seq start with 2;

insert into todo (id,name,todo_type) values (1,'ToDo', 1);

# --- !Downs
drop table if exists todo;

drop sequence if exists todo_seq;