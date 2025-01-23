using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KubicekKocnar.Server.Migrations
{
    /// <inheritdoc />
    public partial class Enemies : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Enemy",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<uint>(
                name: "TextureId",
                table: "Enemy",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0u);

            migrationBuilder.CreateIndex(
                name: "IX_Enemy_TextureId",
                table: "Enemy",
                column: "TextureId");

            migrationBuilder.AddForeignKey(
                name: "FK_Enemy_Textures_TextureId",
                table: "Enemy",
                column: "TextureId",
                principalTable: "Textures",
                principalColumn: "TextureId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Enemy_Textures_TextureId",
                table: "Enemy");

            migrationBuilder.DropIndex(
                name: "IX_Enemy_TextureId",
                table: "Enemy");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "Enemy");

            migrationBuilder.DropColumn(
                name: "TextureId",
                table: "Enemy");
        }
    }
}
