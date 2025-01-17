using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KubicekKocnar.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddEnemyTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Enemy",
                columns: table => new
                {
                    EnemyId = table.Column<uint>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Health = table.Column<float>(type: "REAL", nullable: false),
                    Damage = table.Column<float>(type: "REAL", nullable: false),
                    AttackSpeed = table.Column<float>(type: "REAL", nullable: false),
                    Speed = table.Column<float>(type: "REAL", nullable: false),
                    IsGhost = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Enemy", x => x.EnemyId);
                });

            migrationBuilder.CreateTable(
                name: "EnemyLevel",
                columns: table => new
                {
                    EnemiesEnemyId = table.Column<uint>(type: "INTEGER", nullable: false),
                    LevelsLevelId = table.Column<uint>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EnemyLevel", x => new { x.EnemiesEnemyId, x.LevelsLevelId });
                    table.ForeignKey(
                        name: "FK_EnemyLevel_Enemy_EnemiesEnemyId",
                        column: x => x.EnemiesEnemyId,
                        principalTable: "Enemy",
                        principalColumn: "EnemyId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EnemyLevel_Levels_LevelsLevelId",
                        column: x => x.LevelsLevelId,
                        principalTable: "Levels",
                        principalColumn: "LevelId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_EnemyLevel_LevelsLevelId",
                table: "EnemyLevel",
                column: "LevelsLevelId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EnemyLevel");

            migrationBuilder.DropTable(
                name: "Enemy");
        }
    }
}
