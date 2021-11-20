using Microsoft.EntityFrameworkCore.Migrations;

namespace FriendyFy.Data.Migrations
{
    public partial class MinorCommentLikeChange : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CommentLike_PostComment_PostCommentId",
                table: "CommentLike");

            migrationBuilder.RenameColumn(
                name: "PostCommentId",
                table: "CommentLike",
                newName: "CommentId");

            migrationBuilder.RenameIndex(
                name: "IX_CommentLike_PostCommentId",
                table: "CommentLike",
                newName: "IX_CommentLike_CommentId");

            migrationBuilder.AddForeignKey(
                name: "FK_CommentLike_PostComment_CommentId",
                table: "CommentLike",
                column: "CommentId",
                principalTable: "PostComment",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CommentLike_PostComment_CommentId",
                table: "CommentLike");

            migrationBuilder.RenameColumn(
                name: "CommentId",
                table: "CommentLike",
                newName: "PostCommentId");

            migrationBuilder.RenameIndex(
                name: "IX_CommentLike_CommentId",
                table: "CommentLike",
                newName: "IX_CommentLike_PostCommentId");

            migrationBuilder.AddForeignKey(
                name: "FK_CommentLike_PostComment_PostCommentId",
                table: "CommentLike",
                column: "PostCommentId",
                principalTable: "PostComment",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
