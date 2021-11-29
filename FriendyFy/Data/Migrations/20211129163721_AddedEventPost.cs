using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace FriendyFy.Data.Migrations
{
    public partial class AddedEventPost : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EventComment_Events_EventId",
                table: "EventComment");

            migrationBuilder.DropForeignKey(
                name: "FK_EventLike_Events_EventId",
                table: "EventLike");

            migrationBuilder.DropForeignKey(
                name: "FK_EventRepost_Events_EventId",
                table: "EventRepost");

            migrationBuilder.RenameColumn(
                name: "EventId",
                table: "EventRepost",
                newName: "EventPostId");

            migrationBuilder.RenameIndex(
                name: "IX_EventRepost_EventId",
                table: "EventRepost",
                newName: "IX_EventRepost_EventPostId");

            migrationBuilder.RenameColumn(
                name: "EventId",
                table: "EventLike",
                newName: "EventPostId");

            migrationBuilder.RenameIndex(
                name: "IX_EventLike_EventId",
                table: "EventLike",
                newName: "IX_EventLike_EventPostId");

            migrationBuilder.RenameColumn(
                name: "EventId",
                table: "EventComment",
                newName: "EventPostId");

            migrationBuilder.RenameIndex(
                name: "IX_EventComment_EventId",
                table: "EventComment",
                newName: "IX_EventComment_EventPostId");

            migrationBuilder.CreateTable(
                name: "EventPost",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    EventId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    CreatorId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EventPost", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EventPost_AspNetUsers_CreatorId",
                        column: x => x.CreatorId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_EventPost_Events_EventId",
                        column: x => x.EventId,
                        principalTable: "Events",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_EventPost_CreatorId",
                table: "EventPost",
                column: "CreatorId");

            migrationBuilder.CreateIndex(
                name: "IX_EventPost_EventId",
                table: "EventPost",
                column: "EventId");

            migrationBuilder.AddForeignKey(
                name: "FK_EventComment_EventPost_EventPostId",
                table: "EventComment",
                column: "EventPostId",
                principalTable: "EventPost",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_EventLike_EventPost_EventPostId",
                table: "EventLike",
                column: "EventPostId",
                principalTable: "EventPost",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_EventRepost_EventPost_EventPostId",
                table: "EventRepost",
                column: "EventPostId",
                principalTable: "EventPost",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EventComment_EventPost_EventPostId",
                table: "EventComment");

            migrationBuilder.DropForeignKey(
                name: "FK_EventLike_EventPost_EventPostId",
                table: "EventLike");

            migrationBuilder.DropForeignKey(
                name: "FK_EventRepost_EventPost_EventPostId",
                table: "EventRepost");

            migrationBuilder.DropTable(
                name: "EventPost");

            migrationBuilder.RenameColumn(
                name: "EventPostId",
                table: "EventRepost",
                newName: "EventId");

            migrationBuilder.RenameIndex(
                name: "IX_EventRepost_EventPostId",
                table: "EventRepost",
                newName: "IX_EventRepost_EventId");

            migrationBuilder.RenameColumn(
                name: "EventPostId",
                table: "EventLike",
                newName: "EventId");

            migrationBuilder.RenameIndex(
                name: "IX_EventLike_EventPostId",
                table: "EventLike",
                newName: "IX_EventLike_EventId");

            migrationBuilder.RenameColumn(
                name: "EventPostId",
                table: "EventComment",
                newName: "EventId");

            migrationBuilder.RenameIndex(
                name: "IX_EventComment_EventPostId",
                table: "EventComment",
                newName: "IX_EventComment_EventId");

            migrationBuilder.AddForeignKey(
                name: "FK_EventComment_Events_EventId",
                table: "EventComment",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_EventLike_Events_EventId",
                table: "EventLike",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_EventRepost_Events_EventId",
                table: "EventRepost",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
