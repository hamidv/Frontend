(function () {
  class Comment {
    constructor(userName, text, commentList) {
      this.userName = userName;
      this.text = text;
      this.commentList = commentList;
    }
    save() {
      var commentList = JSON.parse(localStorage.getItem("commentList")) || [];
      commentList.push(this);
      createCommentView(commentList);
    }
    reply(userName, text) {
      var reply = new Comment(userName, text, []);
      this.commentList.push(reply);
    }
    edit(editedText) {
      var commentList = JSON.parse(localStorage.getItem("commentList")) || [];
      commentList = findAndUpdateComment(commentList, this, "edit", editedText);
      createCommentView(commentList);
    }
    delete() {
      var commentList = JSON.parse(localStorage.getItem("commentList")) || [];
      commentList = findAndUpdateComment(commentList, this, "delete");
      createCommentView(commentList);
    }
    updateReplyList() {
      var commentList = JSON.parse(localStorage.getItem("commentList")) || [];
      commentList = findAndUpdateComment(commentList, this);
      createCommentView(commentList);
    }
  }

  function findAndUpdateComment(
    commentList,
    comment,
    action = "reply",
    editedText = ""
  ) {
    for (let i = 0; i < commentList.length; i++) {
      if (
        commentList[i].text == comment.text &&
        commentList[i].userName == comment.userName
      ) {
        if (action == "delete") commentList.splice(i, 1);
        else if (action == "edit") commentList[i].text = editedText;
        else commentList[i] = comment;

        return commentList;
      }
      if (commentList[i].commentList.length > 0) {
        findAndUpdateComment(
          commentList[i].commentList,
          comment,
          action,
          editedText
        );
      }
    }
    return commentList;
  }

  function createCommentView(commentList) {
    let docFrag = document.createDocumentFragment();
    docFrag.appendChild(showComments(commentList));
    document.getElementById("viewComments").innerHTML = "";
    document.getElementById("viewComments").appendChild(docFrag);
    localStorage.setItem("commentList", JSON.stringify(commentList));
  }

  function createComment(userName, text) {
    var comment = new Comment(userName, text, []);
    comment.save();
    return comment;
  }

  function showComments(commentList) {
    var mainUL = document.createElement("ul");
    mainUL.setAttribute("class", "mainUL");
    for (var i = 0; i < commentList.length; i++) {
      var comment = new Comment(
        commentList[i].userName,
        commentList[i].text,
        commentList[i].commentList
      );
      var li = createLi(comment);
      mainUL.appendChild(li);
      if (commentList[i].commentList.length > 0) {
        mainUL.appendChild(showComments(commentList[i].commentList));
      }
    }
    return mainUL;
  }

  function createLi(comment) {
    // main li element
    let li = document.createElement("li");

    // main div for the li element
    let mainDiv = document.createElement("div");
    mainDiv.setAttribute("class", "mainDiv");

    //commentDiv which will have comment and username
    let commentDiv = document.createElement("div");
    commentDiv.setAttribute("class", "commentDiv");

    let commentUserNameDiv = document.createElement("div");
    commentUserNameDiv.setAttribute("class", "commentUserNameDiv");
    commentUserNameDiv.innerHTML = comment.userName;

    let commentTextDiv = document.createElement("div");
    commentTextDiv.innerHTML = comment.text;

    commentDiv.appendChild(commentUserNameDiv);
    commentDiv.appendChild(commentTextDiv);

    //reply username div
    var replyUserNameDiv = document.createElement("div");

    var replyUsernameInput = document.createElement("input");
    replyUsernameInput.setAttribute("class", "replyUsernameInput");
    replyUsernameInput.setAttribute("placeholder", "Username");
    replyUserNameDiv.appendChild(replyUsernameInput);

    // reply comment div
    let replyCommentDiv = document.createElement("div");
    replyCommentDiv.setAttribute("class", "replyCommentDiv");

    let replyCommentInput = document.createElement("input");
    replyCommentInput.setAttribute("class", "replyCommentInput");
    replyCommentInput.setAttribute("placeholder", "Comment");
    replyCommentDiv.appendChild(replyCommentInput);

    //reply post button which will create a new comment
    let postReplyButton = document.createElement("button");
    postReplyButton.innerHTML = "Post";
    postReplyButton.onclick = function () {
      let content = replyCommentInput.value;
      let user = replyUsernameInput.value;
      comment.reply(user, content);
      comment.updateReplyList();
    };

    let cancelReplyButton = document.createElement("button");
    cancelReplyButton.innerHTML = "Cancel";
    cancelReplyButton.onclick = function () {
      actionDiv.setAttribute("class", "actionDiv");
      hiddenReplyDiv.style.cssText = "display: none;";
      editButton.style.cssText = "";
      deleteButton.style.cssText = "";
      replyButton.style.cssText = "";
    };

    let hiddenReplyDiv = document.createElement("div");
    hiddenReplyDiv.style.cssText = "display:none";
    hiddenReplyDiv.appendChild(replyUserNameDiv);
    hiddenReplyDiv.appendChild(replyCommentDiv);
    hiddenReplyDiv.appendChild(postReplyButton);
    hiddenReplyDiv.appendChild(cancelReplyButton);

    // edit comment div
    let editCommentDiv = document.createElement("div");
    editCommentDiv.setAttribute("class", "editCommentDiv");

    let editCommentInput = document.createElement("input");
    editCommentInput.setAttribute("class", "editCommentInput");
    editCommentInput.setAttribute("placeholder", "Comment");
    editCommentDiv.appendChild(editCommentInput);

    //edit post button which will update the current comment
    let postEditButton = document.createElement("button");
    postEditButton.innerHTML = "Update";
    postEditButton.onclick = function () {
      let editedText = editCommentInput.value;
      comment.edit(editedText);
    };

    let cancelEditButton = document.createElement("button");
    cancelEditButton.setAttribute("id", "CancelEdit");
    cancelEditButton.innerHTML = "Cancel";
    cancelEditButton.onclick = function () {
      actionDiv.setAttribute("class", "actionDiv");
      hiddenEditDiv.style.cssText = "display: none;";
      editButton.style.cssText = "";
      deleteButton.style.cssText = "";
      replyButton.style.cssText = "";
    };

    let hiddenEditDiv = document.createElement("div");
    hiddenEditDiv.style.cssText = "display:none";
    hiddenEditDiv.appendChild(editCommentDiv);
    hiddenEditDiv.appendChild(postEditButton);
    hiddenEditDiv.appendChild(cancelEditButton);

    //action div
    let replyButton = document.createElement("button");
    let editButton = document.createElement("button");
    let deleteButton = document.createElement("button");

    replyButton.innerHTML = "Reply";
    replyButton.onclick = function () {
      editButton.style.cssText = "display:none";
      deleteButton.style.cssText = "display:none";
      replyButton.style.cssText = "display:none";
      hiddenReplyDiv.style.cssText = "";
      hiddenReplyDiv.parentElement.setAttribute("class", "hiddenReplyDiv");
    };

    editButton.innerHTML = "Edit";
    editButton.onclick = function () {
      editButton.style.cssText = "display:none";
      deleteButton.style.cssText = "display:none";
      replyButton.style.cssText = "display:none";
      hiddenEditDiv.style.cssText = "";
      hiddenEditDiv.parentElement.setAttribute("class", "hiddenReplyDiv");
      editCommentInput.value = comment.text;
    };

    deleteButton.innerHTML = "Delete";
    deleteButton.onclick = function () {
      if (confirm("Are you sure?")) {
        comment.delete();
      }
    };

    // replyDiv, editDiv which will show up on click of reply/edit button
    let actionDiv = document.createElement("div");
    actionDiv.setAttribute("class", "actionDiv");

    actionDiv.appendChild(replyButton);
    actionDiv.appendChild(editButton);
    actionDiv.appendChild(deleteButton);
    actionDiv.appendChild(hiddenReplyDiv);
    actionDiv.appendChild(hiddenEditDiv);

    // add commenDiv and actionDiv to mainDiv
    mainDiv.appendChild(commentDiv);
    mainDiv.appendChild(actionDiv);

    // add main div to li
    li.appendChild(mainDiv);

    return li;
  }

  document.getElementById("post").addEventListener("click", function () {
    var userName = document.getElementById("userName");
    var content = document.getElementById("joinDiscussion");
    if (userName.value && content.value) {
      createComment(userName.value, content.value);
      userName.value = "";
      content.value = "";
    } else {
      alert("Please provide the request data.");
      content.value ? userName.focus() : content.focus();
    }
  });

  var commentList =
    JSON.parse(window.localStorage.getItem("commentList")) || [];
  if (commentList.length) {
    createCommentView(commentList);
  }
})();
