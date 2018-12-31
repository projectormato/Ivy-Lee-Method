# --- First database schema

# --- !Ups
create table todo (
  id                        serial,
  name                      varchar(255) not null,
  todo_type                 bigint not null,
  primary key (id)
  );

insert into todo (name,todo_type) values ('今日', 1);
insert into todo (name,todo_type) values ('いつか', 2);
insert into todo (name,todo_type) values ('まとめて', 3);

# --- !Downs
drop table if exists todo;

