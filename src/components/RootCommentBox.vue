<script setup>
import CommentBox from './BaseCommentBox.vue';

/**
 * @typedef SubCommentData
 * @property authorId
 * @property content
 * @property rootCommentId
 * @property replyToUserId
 */
/**
 * @typedef CommentData
 * @property articleId
 * @property authorId
 * @property content
 * @property subComments
 */
const props = defineProps({
  commentData: Object
})
</script>


<template>
    <CommentBox :is-child="false" :comment-data="props.commentData">
    </CommentBox>
</template>