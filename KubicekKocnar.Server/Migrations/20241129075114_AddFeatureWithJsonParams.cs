using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KubicekKocnar.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddFeatureWithJsonParams : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FeatureParams");

            migrationBuilder.AddColumn<string>(
                name: "Params",
                table: "Features",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Params",
                table: "Features");

            migrationBuilder.CreateTable(
                name: "FeatureParams",
                columns: table => new
                {
                    Id = table.Column<uint>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    FeatureId = table.Column<uint>(type: "INTEGER", nullable: true),
                    Key = table.Column<string>(type: "TEXT", nullable: false),
                    Value = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FeatureParams", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FeatureParams_Features_FeatureId",
                        column: x => x.FeatureId,
                        principalTable: "Features",
                        principalColumn: "FeatureId");
                });

            migrationBuilder.CreateIndex(
                name: "IX_FeatureParams_FeatureId",
                table: "FeatureParams",
                column: "FeatureId");
        }
    }
}
