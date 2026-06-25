using FluentMigrator;

namespace Api.Migrations;

[Migration(202606240001)]
public class AddDashboards : Migration
{
    public override void Up()
    {
        // Create Dashboards table if it doesn't exist
        if (!Schema.Table("Dashboards").Exists())
        {
            Create.Table("Dashboards")
                .WithColumn("Id").AsGuid().PrimaryKey()
                .WithColumn("Name").AsString(200).NotNullable()
                .WithColumn("CreatedAt").AsDateTime().NotNullable()
                .WithColumn("UpdatedAt").AsDateTime().NotNullable();
        }

        // Add DashboardId to Widgets table if it doesn't exist
        if (!Schema.Table("Widgets").Column("DashboardId").Exists())
        {
            Alter.Table("Widgets")
                .AddColumn("DashboardId").AsGuid().Nullable();

            // Create a default dashboard and migrate existing widgets
            Execute.Sql(@"
                INSERT INTO ""Dashboards"" (""Id"", ""Name"", ""CreatedAt"", ""UpdatedAt"")
                SELECT gen_random_uuid(), 'Main Dashboard', NOW(), NOW()
                WHERE NOT EXISTS (SELECT 1 FROM ""Dashboards"");
                
                UPDATE ""Widgets""
                SET ""DashboardId"" = (SELECT ""Id"" FROM ""Dashboards"" ORDER BY ""CreatedAt"" LIMIT 1)
                WHERE ""DashboardId"" IS NULL;
            ");

            // Make DashboardId not nullable now that we've set values
            Alter.Table("Widgets")
                .AlterColumn("DashboardId").AsGuid().NotNullable();

            // Create foreign key
            Create.ForeignKey("FK_Widgets_Dashboards")
                .FromTable("Widgets").ForeignColumn("DashboardId")
                .ToTable("Dashboards").PrimaryColumn("Id")
                .OnDelete(System.Data.Rule.Cascade);

            // Drop old index if exists and create new composite index
            if (Schema.Table("Widgets").Index("IX_Widgets_Position").Exists())
            {
                Delete.Index("IX_Widgets_Position").OnTable("Widgets");
            }
            
            if (!Schema.Table("Widgets").Index("IX_Widgets_DashboardId_Position").Exists())
            {
                Create.Index("IX_Widgets_DashboardId_Position")
                    .OnTable("Widgets")
                    .OnColumn("DashboardId").Ascending()
                    .OnColumn("Position").Ascending();
            }
        }
    }

    public override void Down()
    {
        if (Schema.Table("Widgets").Constraint("FK_Widgets_Dashboards").Exists())
        {
            Delete.ForeignKey("FK_Widgets_Dashboards").OnTable("Widgets");
        }
        
        if (Schema.Table("Widgets").Index("IX_Widgets_DashboardId_Position").Exists())
        {
            Delete.Index("IX_Widgets_DashboardId_Position").OnTable("Widgets");
        }
        
        if (Schema.Table("Widgets").Column("DashboardId").Exists())
        {
            Delete.Column("DashboardId").FromTable("Widgets");
        }
        
        if (Schema.Table("Dashboards").Exists())
        {
            Delete.Table("Dashboards");
        }
        
        if (!Schema.Table("Widgets").Index("IX_Widgets_Position").Exists())
        {
            Create.Index("IX_Widgets_Position").OnTable("Widgets").OnColumn("Position").Ascending();
        }
    }
}

