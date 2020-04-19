let commentsArr = [];
let commentId = 0;
let commentsDiv = document.querySelector('.comments');

commentsDiv.addEventListener('click', (e) => {
    if (e.target.tagName == 'BUTTON') {
        switch (e.target.id) {
            case 'Edit':
                editComment(e.target.dataset.cid);
                break;
            case 'SubmitEdit':
                submitEditComment(e.target.dataset.cid);
                break;
            case 'CancelEdit':
                cancelEditComment(e.target.dataset.cid);
                break;
            case 'Delete':
                deleteComment(e.target.dataset.cid);
                break;
            case 'Reply':
                replyComment(e.target.dataset.cid);
                break;
            case 'SubmitReply':
                submitReplyComment(e.target.dataset.cid);
                break;
            case 'CancelReply':
                cancelReplyComment(e.target.dataset.cid);
                break;
        }
    }
});

const submitComment = function() {
    let comment = document.querySelector('#txtComment');
    if (comment.value) {
        // insert new comment to the comment array
        commentsArr.push({cid: ++commentId, comment: comment.value, comments: []});

        // add the inserted comment into the comment list
        let elm = createCommentElement(commentId, comment.value);
        commentsDiv.appendChild(elm);

        // clear the comment entry box
        comment.value = '';
    }
};

const editComment = function(cid) {
    let currElement = commentsDiv.querySelector('#c_' + cid)
    
    // hide action panel
    currElement.querySelector('.action').setAttribute('style', 'display: none');

    // create edit elements
    let editCommentDiv = document.createElement('div');
    editCommentDiv.setAttribute('class', 'comment-edit');

    let editText = document.createElement('TEXTAREA');
    editText.setAttribute('id', 'txtEdit');
    editText.value = currElement.querySelector('span').innerText;
    editCommentDiv.appendChild(editText);

    let editSubmit = document.createElement('button');
    editSubmit.setAttribute('id', 'SubmitEdit');
    editSubmit.setAttribute('data-cid', cid);
    editSubmit.innerHTML = "Submit";
    editCommentDiv.appendChild(editSubmit);

    let cancelSubmit = document.createElement('button');
    cancelSubmit.setAttribute('id', 'CancelEdit');
    cancelSubmit.setAttribute('data-cid', cid);
    cancelSubmit.innerHTML = "Cancel";
    editCommentDiv.appendChild(cancelSubmit);

    currElement.insertBefore(editCommentDiv, currElement.childNodes[1]);
};

const submitEditComment = function(cid) {
    let editComment = commentsDiv.querySelector('#c_' + cid);
    let newCommentText = editComment.querySelector('#txtEdit').value;
    if (newCommentText) {
        // update the selected comment in array
        UpdateCommentToArray(commentsArr, cid, {cid: cid, comment: newCommentText, comments: []}, true);

        // insert the edited comment into the comment list
        editComment.querySelector('span').innerText = newCommentText;
        
        // remove edit panel
        editComment.removeChild(editComment.querySelector('.comment-edit'));

        // show action panel
        editComment.querySelector('.action').setAttribute('style', '');
    }
};

const cancelEditComment = function(cid) {
    let currElement = commentsDiv.querySelector('#c_' + cid);

    // remove edit panel
    currElement.removeChild(currElement.querySelector('.comment-edit'));

    // show action panel
    currElement.querySelector('.action').setAttribute('style', '');
};

const deleteComment = function(cid) {
    if (confirm("Are you sure?")) {
        // remove the selected comment from the comment array
        deleteCommentFromArray(commentsArr, cid);

        // remove rhe deleted comment form the comment list
        let deletedComment = commentsDiv.querySelector('#c_' + cid);
        deletedComment.parentElement.removeChild(deletedComment);
    }
};

const replyComment = function(cid) {
    let currElement = commentsDiv.querySelector('#c_' + cid);
    
    // hide action panel
    currElement.querySelector('.action').setAttribute('style', 'display: none');

    // create reply elements
    let replyCommentDiv = document.createElement('div'); 
    replyCommentDiv.setAttribute('class', 'comment-reply');

    let replyText = document.createElement('TEXTAREA');
    replyText.setAttribute('id', 'txtReply');
    replyCommentDiv.appendChild(replyText);

    let replySubmit = document.createElement('button');
    replySubmit.setAttribute('id', 'SubmitReply');
    replySubmit.setAttribute('data-cid', cid);
    replySubmit.innerHTML = "Submit";
    replyCommentDiv.appendChild(replySubmit);

    let cancelSubmit = document.createElement('button');
    cancelSubmit.setAttribute('id', 'CancelReply');
    cancelSubmit.setAttribute('data-cid', cid);
    cancelSubmit.innerHTML = "Cancel";
    replyCommentDiv.appendChild(cancelSubmit);

    currElement.insertBefore(replyCommentDiv, currElement.childNodes[1]);
};

const cancelReplyComment = function(cid) {
    let currElement = commentsDiv.querySelector('#c_' + cid);

    // remove reply panel
    currElement.removeChild(currElement.querySelector('.comment-reply'));

    // show action panel
    currElement.querySelector('.action').setAttribute('style', '');
};

const submitReplyComment = function(cid) {
    let replyComment = commentsDiv.querySelector('#c_' + cid);
    let newCommentText = replyComment.querySelector('#txtReply').value;
    if (newCommentText) {
        // insert the comment into array
        UpdateCommentToArray(commentsArr, cid, {cid: ++commentId, comment: newCommentText, comments: []});

        // insert the reply comment into the comment list
        let newComment = createCommentElement(commentId, newCommentText);
        replyComment.appendChild(newComment);

        // remove edit panel
        replyComment.removeChild(replyComment.querySelector('.comment-reply'));
        
        // show action panel
        replyComment.querySelector('.action').setAttribute('style', '');
    }
};

const UpdateCommentToArray = function(commentsArr, cid, newComment, isEdit = false) {
    if (commentsArr.cid == cid) {
        if (isEdit) {
            commentsArr.comment = newComment.comment;
        } else {
            commentsArr.comments.push(newComment);
        }
        return commentsArr;
    }

    for (let i = 0; i < Object.keys(commentsArr).length; i++) {
        const nextObject = commentsArr[Object.keys(commentsArr)[i]];
        if (nextObject && typeof nextObject === "object") {
            let item = UpdateCommentToArray(nextObject, cid, newComment, isEdit);
            if (item != null) {
                return item;
            }
        }
    }

    return null;
}

const deleteCommentFromArray = function(commentsArr, cid) {
    for (let i=0; i<commentsArr.length; i++) {
        if (commentsArr[i].cid == cid) {
            commentsArr.splice(i, 1);
            return;
        } else {
            if (commentsArr[i].comments.length)
                return deleteCommentFromArray(commentsArr[i].comments, cid);
            else
                return;
        }
    }
}

const createCommentElement = function(id, commentBody) {
    let commentDiv = document.createElement('div');
    let commentSpan = document.createElement('span');
    let commentActionDiv = document.createElement('div');
    let commentEditAction = document.createElement('button');
    let commentDeleteAction = document.createElement('button');
    let commentReplyAction = document.createElement('button');

    commentDiv.setAttribute('id', 'c_' + id);
    commentDiv.setAttribute('class', 'comment');

    commentSpan.innerHTML = commentBody;

    commentDiv.appendChild(commentSpan);

    commentActionDiv.setAttribute('class', 'action');

    commentActionDiv.appendChild(commentReplyAction);
    commentReplyAction.setAttribute('id', 'Reply');
    commentReplyAction.setAttribute('data-cid', id);
    commentReplyAction.innerHTML = "Reply";

    commentActionDiv.appendChild(commentDeleteAction);
    commentDeleteAction.setAttribute('data-cid', id);
    commentDeleteAction.setAttribute('id', 'Delete');
    commentDeleteAction.innerHTML = "Delete";

    commentActionDiv.appendChild(commentEditAction);
    commentEditAction.setAttribute('data-cid', id);
    commentEditAction.setAttribute('id', 'Edit');
    commentEditAction.innerHTML = "Edit";

    commentDiv.appendChild(commentActionDiv);

    return commentDiv;
}