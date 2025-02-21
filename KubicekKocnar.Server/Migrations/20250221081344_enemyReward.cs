using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KubicekKocnar.Server.Migrations
{
    /// <inheritdoc />
    public partial class enemyReward : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<uint>(
                name: "EnemyId",
                table: "Cost",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Cost_EnemyId",
                table: "Cost",
                column: "EnemyId");

            migrationBuilder.AddForeignKey(
                name: "FK_Cost_Enemy_EnemyId",
                table: "Cost",
                column: "EnemyId",
                principalTable: "Enemy",
                principalColumn: "EnemyId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Cost_Enemy_EnemyId",
                table: "Cost");

            migrationBuilder.DropIndex(
                name: "IX_Cost_EnemyId",
                table: "Cost");

            migrationBuilder.DropColumn(
                name: "EnemyId",
                table: "Cost");
        }
    }
}
