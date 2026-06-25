using FluentMigrator;

namespace Api.Migrations;

[Migration(1)]
public class InitialCreate : Migration
{
    public override void Up()
    {
        Create.Table("Widgets")
            .WithColumn("Id").AsGuid().PrimaryKey()
            .WithColumn("Type").AsInt32().NotNullable()
            .WithColumn("Position").AsInt32().NotNullable()
            .WithColumn("Data").AsString(5000).Nullable()
            .WithColumn("CreatedAt").AsDateTime().NotNullable()
            .WithColumn("UpdatedAt").AsDateTime().NotNullable();

        Create.Index("IX_Widgets_Position")
            .OnTable("Widgets")
            .OnColumn("Position");
    }

    public override void Down()
    {
        Delete.Table("Widgets");
    }
}

