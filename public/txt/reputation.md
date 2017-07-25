## System Requirements
8 x 1.8 GHz CPU (Dual Quad-Core Xeon E5320)

4 GB RAM

271GB HDD


## Content License
Attribution-NonCommercial-ShareAlike 4.0 International


## Scheduled Tasks
node-cron


### Favorite
Click to favorite. Click again to un-favorite. Once favorited, these questions will show up in the “Favorites” tab on your user profile page. The default order is last modified, so favorite questions with the most recent edits or answers will shuffle to the top.


### Tag Search
Now, to be clear, we do a fuzzy title-based search when you tab off the title field on the Ask page.
https://zgab33vy595fw5zq-zippykid.netdna-ssl.com/wp-content/uploads/2017/02/stackoverflow-ask-title-related.png

I made a special effort to improve the “no search results found” page. It shows a number of easy ways to immediately improve your search results based on my experience searching for stuff on SO:
https://zgab33vy595fw5zq-zippykid.netdna-ssl.com/wp-content/uploads/2017/02/stackoverflow-enhanced-search-no-matches.png

In particular, I’d urge you to take the advice to search within tags to heart. Google kind of sucks at this; you will generally get much better results if you scope your search to one or more likely tags such as [ruby] or [perl]. Just add the tags in brackets to your regular search terms, in any order, as many as you like (note that you cannot yet specify negation for tags in search).
https://zgab33vy595fw5zq-zippykid.netdna-ssl.com/wp-content/uploads/2017/02/stackoverflow-search-with-tags.png

Search now heavily weights title in the results, since people seemed to really like that approach. This is currently used on the /ask page, which does a title-exclusive search when you tab away (onblur) the title field.
Any individual search terms which map directly to the top 40 tags will be auto-converted to tag searches. So if you enter

c++ entities

it will convert to

[c++] entities

automagically on your behalf.


### Tag And
Let’s say I clicked on the Python tag, anywhere on the Stack Overflow site. Clicking on a tag zips you away to a view of all the questions within that particular tag. Within the tag view, you can sort and browse as expected, but you can also click the related tags in the right sidebar to combine tags, like so:
https://zgab33vy595fw5zq-zippykid.netdna-ssl.com/wp-content/uploads/2017/02/stackoverflow-tagged-related-series.png


### Tag Preferences
Geoff “the malice from corvallis” Dalgas has done it again. Over the last week he was busy implementing the number one UserVoice request — tag preferences for a customized Stack Overflow homepage.
https://zgab33vy595fw5zq-zippykid.netdna-ssl.com/wp-content/uploads/2017/02/stackoverflow-ignored-interesting.png

You’ll notice there are two places you can now enter your ignored tags and interesting tags.

1. On most question pages, in the right sidebar
2. On your users page, under the “Preferences” tab

Once you’ve enter some tag preferences, the questions appear differently depending on whether they contain a tag in your list.
Interesting questions are highlighted; ignored questions are dimmed.

Today’s new feature will be useful for those of you who happen to have a lot of ignored and/or interesting tags. You can now use the asterisk to set up wildcard matches, rather than having to laboriously construct a list of every single tag as before.
https://zgab33vy595fw5zq-zippykid.netdna-ssl.com/wp-content/uploads/2017/02/stackoverflow-ignored-interesting-wildcards.png

Simply specify one or more asterisks to match any number of characters, either in the middle, the beginning, or the end of a tag. So all these should work as you might expect:

- ```*.net*```
- ```jquery*```
- ```*c++```


### IP Ban
We’ve noticed there are a number of users running a script that retrieves their uncompressed user page multiple times per second, producing an absurd amount of network traffic. Fortunately, we do cache the user page if the requests come in anonymously, so the database load was not significant.

However, this behavior is irresponsible and unacceptable, so we will permanently ban any IP we see doing this. We’ve already banned about a dozen IPs for this, and we will continue to do so. If you persist, your account will be permanently deleted. We might even lay down long term IP block bans if necessary.


### Vote Change
1. In general, once you have voted, you cannot change your vote. There are two exceptions.
2. Exception one: you may change your vote a practically unlimited number of times within a five minutes window from the first vote you cast on that post. Note that after changing your vote ≈60 times, it will also be locked in.
3. Exception two: you may change your vote after every time the post is edited. A new window starts with the first vote you cast after each edit.
4. To simply undo a vote — i.e. make it as if you had never voted in the first place — click the "lit up" vote button. The result will be that neither an upvote nor a downvote is active, and you can come back to vote any time you like. Only cast votes are locked in.
5. To reverse a vote — i.e. change an upvote to a downvote or vice versa — click the "unlit" vote button, as you usually would. There is no need to perform an undo first.
6. Close votes can be retracted on any question which hasn't already been closed or your vote hasn't aged away, but you do not regain the vote to cast again and cannot re-cast another close vote on the same question.


### Vote Limit
If you irritate another user, they might be having a bad day and decide to take it out on you by methodically going through and downvoting every post you’ve made. The impact of this is pretty limited on Stack Overflow, as you only get 30 votes per day, and upvotes are +10 while downvotes are only -2 (and -1 to the votee).

As of today, we have several queries that look for unusual downvote patterns. If we discover these patterns in a given user’s voting history, we view all their downvotes for that user as suspect. They’re all silently deleted, and any lost reputation is restored to the unfortunate target of these downvotes.

We take any reports of exploits or problems on Stack Overflow very seriously, and they’re all investigated. In particular, we will not tolerate gaming our vote system.

1. We can automatically detect sockpuppet accounts now. Sockpuppets used for the purpose of upvoting or downvoting will be deleted, and their votes — cancelled.
2. We now perform a more detailed statistical analysis on voting patterns. Any voting patterns that are too far outside the statistical norm will be nullified.

The bottom line is this: it will always be easier to earn reputation legitimately — by asking good questions and providing great answers — than by gaming the system.


### Reputation Cap
It’s your daily dose of everyone’s best friend, the +200 per day Stack Overflow reputation cap!

1. Accepted answers are now immune to the daily reputation cap. Again. This time as part of a policy and not a bug.
2. Partial votes will be awarded if necessary to reach the daily reputation cap. In other words, if you are at 195 today, and someone casts an upvote for your posts right now, you’ll get 5 reputation. Prior to tonight, you’d get none.


### Post Cap
If you’re a new user, with reputation below 100:

1. You may only post 1 question every 20 minutes
2. You may only post 1 answer every 3 minutes

This is tracked at the IP address level, so multiple posts from the same IP, even as different “users”, will still be blocked.


### Post Comments
Some ground rules:

1. There is no downvoting of comments, only upvotes.
2. Comment votes do not affect comment sort order.
3. No reputation of any kind is earned or lost from comment votes.
4. Each user gets 5 comment flag votes, and 30 comment upvotes, per day.
5. If a comment is flagged by enough users it will be auto-soft-deleted. There is no penalty for this.. yet. Flagged comments will be surfaced to moderators, so if you have a problem with a comment, flag it.

You can always delete your own comments. We are removing the ability for users with 5,000 rep to delete comments on their posts — flagging should now be sufficient for this purpose.

(your best comments will also show up in your user profile page, but this isn’t implemented yet.)

1. 30 comment upvotes per day per user
2. As with post votes, upvotes can be cast by users with 15 or more reputation. There is no way to downvote comments.


### Post Flags
1. You still need 15 reputation to flag anything at all.
2. Each user gets a limited number of flags per day (5 offensive, 5 spam, and 10 inform moderator).
3. These flags age. After two days, they automatically dissipate harmlessly and without effect from the system.
4. If an individual post reaches a threshold of six offensive or spam votes within two days, it will be automatically deleted from the system by the Community user.
5. You cannot flag the same post multiple times.
6. Flag counts are no longer shown to anyone except moderators.


### Post Close
1. You see a question that is inappropriate for Stack Overflow because it’s not programming related.
2. You have 3,000 reputation, the minimum required to cast close or open votes.
3. You vote to close this question.
4. Four (4) other users also vote to close this question, reaching a total of five (5) closure votes (or, a moderator votes to close — moderator votes are binding.)
5. Once closed, the question can be reopened by voting to open in the same manner. If the question garners five (5) votes to reopen, the process starts over at step #3.
6. If question remains closed for 48 full hours, it is now eligible for deletion.
7. You have 10,000 reputation, the minimum required to cast deletion votes.
8. If the question gets three (3) deletion votes (or a moderator vote), the question is deleted.
9. Note that deleted questions are invisible to typical users — but can be seen by moderators and users with 10,000+ reputation.
10. The question can be undeleted at any time by voting for undeletion in the same manner. If the question garners three votes for undeletion, the process starts over at step #7.

### Post Deletion
1. Post authors can delete their answers. But they can only delete their questions when there are no significantly upvoted answers to the question.
2. Users with 10,000+ reputation can delete questions that have been closed for 48 hours, if they cast three (3) votes for deletion. Questions can be undeleted through the same process in reverse.
3. Moderators can delete anything.

1. Some questions are of such poor quality that they cannot be salvaged. They’re literally nonsense. Not every byte of data that is created in the world is infinite and sacred.
2. Some questions are so incredibly off topic that they add no value to a programming community.
3. The mental cost of processing these closed questions is not zero, particularly for users who are actively engaged and scanning questions to find things they can help answer.
4. If users see a lot of closed questions, they’ll note that we don’t enforce the guidelines, so why should they? Without any final resolution, asking questions that get closed becomes something we are implicitly encouraging — a broken windows problem. If this goes on for long enough, we’re no longer a community of programmers who ask and answer programming questions, we’re a community of random people discussing.. whatever. That’s toxic.
5. If enough of these closed questions are allowed to hang around, they become clutter that reduces the overall signal to noise ratio — which further reduces confidence in the system.

### Account Suspension
No effort to learn and improve over time

1. This user does not put reasonable effort into the questions they ask of the community.
2. There is little or no evidence of this user learning over time, either in the topic itself or in the community norms on the site.
3. This user intentionally spams the site with the same question or very similar questions, over and over.
4. The user never gives anything back to the community, but only takes.

Disruptive behavior

1. Other users tend to react poorly to this user’s contributions, posting negative responses in kind and generally causing a commotion.
2. There is a broad sense of community resentment over this user’s behavior, and they are frequently cited in discussion about the community.
3. There is a dark storm cloud of moderator flags that seems to follow this user around wherever they go.
4. The moderators get email complaints about this user’s behavior.
5. This user makes overtly snide, rude, or hostile comments to their fellow users.

Depending on the severity of the problem behavior — and at the complete discretion of the moderator — your account will be placed in timed suspension for anywhere from 1 to 365 days. That means:

1. Your account will be locked at 1 reputation.
2. Your user page will have a visual indication that you are in timed suspension, and for how long.
3. You will be unable to vote, ask, answer, or comment.

At the end of this timed suspension period, your reputation will be recalculated, and your account will resume as normal. We don’t hold grudges. The point of all this is to address the behavior. If the behavior improves, you are welcome back.

(This should probably go without saying, but if the problem behaviors do continue beyond the timed suspension, your account is very likely to be permanently deleted.)


### Account Deletion
But here’s the question: when is it safe to declare an account abandoned?

We came up with these two rules of thumb. If..

- the user has not visited the site in six months

AND

- the user has not done anything of significance, ever
- .. their accounts are effectively abandoned. We don’t believe those users are ever coming back. With that in mind:

We delete cookie-based unregistered accounts when:

- The user has not visited Stack Overflow in six months

AND

- The user has less than 50 reputation, and no visible (not-deleted) posts

We delete OpenID registered accounts when:

- The user has not visited Stack Overflow in six months

AND

- The user has only 1 reputation, no visible posts, and no other accounts on the network

When someone wants their account deleted we normally ask that they edit the profile and email us – this adds a human sanity-check to the process, since accounts are hard-deleted (unlike posts). However, if you signed up to post a single question and never used your account again, it’s a bit simpler: users with next-to-no presence on the site (left at most one post or one vote, received at most one up-vote, etc.) will see a delete option on their profile:

### Specialist Badges
The long-awaited Specialist badges are now working; you can browse them on the badges page.
https://zgab33vy595fw5zq-zippykid.netdna-ssl.com/wp-content/uploads/2017/02/stackoverflow-tag-based-badges.png


### Edit War
The most common measure of edit warring is the three-revert rule, often abbreviated 3RR. The three-revert rule usefully measures edit warring, as it posits that surpassing three reverts on any one page in under 24 hours is edit warring. While nobody should interpret the three-revert rule blindly, reaching this threshold strongly signals that serious misconduct is afoot. The 3RR metric is not an exemption for conduct that stays under the threshold. For instance, edit warring could take the form of 4+ reverts on a page in a day, or three, or one per day for a protracted period of time, or one per page across many pages, or simply a pattern of isolated blind reverts as a first resort against disagreeable edits.


## Reputation
- All users start with one reputation point.
- No user’s reputation may drop below one point; if an action would cause a user’s reputation to drop below one point, that user only loses enough reputation to drop to one point (source), and the remaining penalty or loss is waived.
- You can earn a maximum of +200 reputation from upvotes and suggested edits in any given day. Bounties and the bonuses for accepted answers are counted separately (source). Reputation “lost” from the reputation cap is not awarded on following days.
- If a vote is cast before a post becomes Community Wiki, but is removed after the post becomes CW, the removal does not affect reputation (source).
- Before May 2011, downvoting questions cost the downvoter one reputation point (source). (After May 2011, no cost for downvoting questions.)
- Deleting and undeleting posts may reverse reputation effects as well, if these posts have votes. Actions previously taken on deleted posts cease to affect reputation within five minutes (source), unless the post meets both the following criteria (in which case the reputation effects will be permanent) (source):
- The post had a score of at least +3
- The post has been visible on the site for at least 60 days
- Accepting your own answer does not gain you any reputation.
- Voting reversal as a result of serial voting will return lost or gained reputation.
- Voted-up comments do not affect reputation.


### Reputation Privileges
- Users with 15 rep can flag posts.
- Users with 500 rep can review posts from new users.
- Users with 2,000 rep can edit any question or answer in the system.
- Users with 3,000 rep can cast close and open votes.
- Users with 10,000 rep can cast delete and undelete votes on questions, and have access to a moderation dashboard.
- Users with 15,000 rep can protect posts.
- Users with 20,000 rep can cast delete votes on negatively voted answers.

Even with active community self-regulation, moderators occasionally need to intervene. Moderators are human exception handlers, there to deal with those (hopefully rare) exceptional conditions that should not normally happen, but when they do, they can bring your entire community to a screaming halt — if you don’t have human exception handling in place.

The most common moderator task is to follow up on flagged posts. Every post contains a small flag link, which anyone with 15 reputation can use.
- Moderator votes are binding. Any place we have voting — close, open, delete, undelete, offensive, migration, etc — that vote will reach the threshold and take effect immediately if a single moderator casts a vote.
- Moderators can lock posts. Locked posts cannot be voted on or changed in any way.
- Moderators can protect questions. Protected questions only allow answers by users with more than 10 reputation.
- Moderators can see more data in the system, including vote statistics (but not ‘who voted for this post’) and user profile information.
- Moderators can place users in timed suspension, and delete users if necessary.
- Moderators can perform large-scale maintenance actions such as merging questions and tags, tag synonym approvals, and so forth.


### Reputation Gain
- one of your questions is voted up/useful: +5†
- one of your answers is voted up/useful: +10
- one of your answers becomes accepted: +15
- you accept an answer written by someone else to one of your own questions: +2
- a downvote on one of your questions or answers is removed: +2
- you suggest an edit and it is accepted: +2 (up to a total of +1000 per user)
- you remove a downvote from an answer: +1
- an answer you downvoted is removed: +1
- one of your answers is awarded a bounty by the user offering the bounty: + full bounty amount
- one of your answers is awarded a bounty automatically: +½ of the bounty amount (see bounty FAQ for details)
- you associate accounts of two or more Stack Exchange network sites, and at least one of those accounts already has 200 or more reputation: +100 on each site (awarded a maximum of one time per site)
- (Stack Overflow only) one of the documentation examples where you are a minor contributor is voted up/useful: +1
- (Stack Overflow only) one of your documentation contributions is approved: +2
- (Stack Overflow only) one of the documentation examples where you are a major contributor is voted up/useful: +5


### Reputation Lose
- one of your questions or answers is voted down/not useful: −2
- a post where you had successfully suggested an edit has been deleted (reputation page shows the cause as removed): −2
- the account of a user who was the final approver of a suggested edit you made has been deleted (reputation page shows the cause as User was removed): −2
- you vote an answer down/not useful: −1
- an upvote on one of your questions is removed: −5
- an upvote on one of your answers is removed: −10
- one of your accepted answers loses accepted status: −15
- you unaccept an answer written by someone else to one of your own questions: −2
- you place a bounty on a question: − full bounty amount
- one of your posts receives 6 spam or rude or abusive (formerly known as offensive flags): −100




