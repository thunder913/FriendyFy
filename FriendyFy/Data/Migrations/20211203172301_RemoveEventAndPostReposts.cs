using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace FriendyFy.Data.Migrations
{
    public partial class RemoveEventAndPostReposts : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Posts_Posts_PostId",
                table: "Posts");

            migrationBuilder.DropTable(
                name: "EventRepost");

            migrationBuilder.DropTable(
                name: "PostRepost");

            migrationBuilder.RenameColumn(
                name: "PostId",
                table: "Posts",
                newName: "RepostId");

            migrationBuilder.RenameIndex(
                name: "IX_Posts_PostId",
                table: "Posts",
                newName: "IX_Posts_RepostId");

            migrationBuilder.AddColumn<string>(
                name: "ApplicationUserId",
                table: "Posts",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsRepost",
                table: "Posts",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsRepost",
                table: "EventPost",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "RepostId",
                table: "EventPost",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Text",
                table: "EventPost",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Posts_ApplicationUserId",
                table: "Posts",
                column: "ApplicationUserId");

            migrationBuilder.CreateIndex(
                name: "IX_EventPost_RepostId",
                table: "EventPost",
                column: "RepostId");

            migrationBuilder.AddForeignKey(
                name: "FK_EventPost_EventPost_RepostId",
                table: "EventPost",
                column: "RepostId",
                principalTable: "EventPost",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Posts_AspNetUsers_ApplicationUserId",
                table: "Posts",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Posts_Posts_RepostId",
                table: "Posts",
                column: "RepostId",
                principalTable: "Posts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EventPost_EventPost_RepostId",
                table: "EventPost");

            migrationBuilder.DropForeignKey(
                name: "FK_Posts_AspNetUsers_ApplicationUserId",
                table: "Posts");

            migrationBuilder.DropForeignKey(
                name: "FK_Posts_Posts_RepostId",
                table: "Posts");

            migrationBuilder.DropIndex(
                name: "IX_Posts_ApplicationUserId",
                table: "Posts");

            migrationBuilder.DropIndex(
                name: "IX_EventPost_RepostId",
                table: "EventPost");

            migrationBuilder.DropColumn(
                name: "ApplicationUserId",
                table: "Posts");

            migrationBuilder.DropColumn(
                name: "IsRepost",
                table: "Posts");

            migrationBuilder.DropColumn(
                name: "IsRepost",
                table: "EventPost");

            migrationBuilder.DropColumn(
                name: "RepostId",
                table: "EventPost");

            migrationBuilder.DropColumn(
                name: "Text",
                table: "EventPost");

            migrationBuilder.RenameColumn(
                name: "RepostId",
                table: "Posts",
                newName: "PostId");

            migrationBuilder.RenameIndex(
                name: "IX_Posts_RepostId",
                table: "Posts",
                newName: "IX_Posts_PostId");

            migrationBuilder.CreateTable(
                name: "EventRepost",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EventPostId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    ModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EventRepost", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EventRepost_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_EventRepost_EventPost_EventPostId",
                        column: x => x.EventPostId,
                        principalTable: "EventPost",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PostRepost",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true),
                    PostId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PostRepost", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PostRepost_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PostRepost_Posts_PostId",
                        column: x => x.PostId,
                        principalTable: "Posts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_EventRepost_EventPostId",
                table: "EventRepost",
                column: "EventPostId");

            migrationBuilder.CreateIndex(
                name: "IX_EventRepost_UserId",
                table: "EventRepost",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_PostRepost_PostId",
                table: "PostRepost",
                column: "PostId");

            migrationBuilder.CreateIndex(
                name: "IX_PostRepost_UserId",
                table: "PostRepost",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Posts_Posts_PostId",
                table: "Posts",
                column: "PostId",
                principalTable: "Posts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
