using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KubicekKocnar.Server.Migrations
{
    /// <inheritdoc />
    public partial class sddssd1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Textures_Items_ItemId",
                table: "Textures");

            migrationBuilder.AlterColumn<uint>(
                name: "IconId",
                table: "Coinages",
                type: "INTEGER",
                nullable: true,
                oldClrType: typeof(uint),
                oldType: "INTEGER");

            migrationBuilder.AddForeignKey(
                name: "FK_Textures_Items_ItemId",
                table: "Textures",
                column: "ItemId",
                principalTable: "Items",
                principalColumn: "ItemId",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Textures_Items_ItemId",
                table: "Textures");

            migrationBuilder.AlterColumn<uint>(
                name: "IconId",
                table: "Coinages",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0u,
                oldClrType: typeof(uint),
                oldType: "INTEGER",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Textures_Items_ItemId",
                table: "Textures",
                column: "ItemId",
                principalTable: "Items",
                principalColumn: "ItemId");
        }
    }
}
