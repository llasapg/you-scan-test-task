using FluentMigrator;

namespace Api.Database.Migrations;

[Migration(1)]
public class InitialCreate : Migration
{
    public override void Up()
    {
        Create.Table("widgets")
            .WithColumn("id").AsGuid().PrimaryKey()
            .WithColumn("type").AsInt32().NotNullable()
            .WithColumn("position").AsInt32().NotNullable()
            .WithColumn("data").AsString(5000).Nullable()
            .WithColumn("created_at").AsDateTime().NotNullable()
            .WithColumn("updated_at").AsDateTime().NotNullable();

        Create.Index("IX_widgets_position")
            .OnTable("widgets")
            .OnColumn("position");
    }

    public override void Down()
    {
        Delete.Table("Widgets");
    }
}

