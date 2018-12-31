name := """ivy-lee-method"""

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

resolvers += Resolver.sonatypeRepo("snapshots")

scalaVersion := "2.12.6"

crossScalaVersions := Seq("2.11.12", "2.12.6")

libraryDependencies += guice
libraryDependencies += "org.scalatestplus.play" %% "scalatestplus-play" % "3.1.2" % Test
libraryDependencies += "com.h2database" % "h2" % "1.4.197"
libraryDependencies += "org.postgresql" % "postgresql" % "42.0.0.jre7"


libraryDependencies += jdbc
libraryDependencies += evolutions
libraryDependencies += filters
libraryDependencies += "com.typesafe.play" %% "anorm" % "2.5.3"
