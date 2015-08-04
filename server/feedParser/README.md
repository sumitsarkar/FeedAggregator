# Feed Parser

The fundamental challenge to a successful feed parser algorithm is the performance hit the server will take. Since, we are going to follow the naive approach of pinging the feeds after a certain interval, we must make sure that we are not naively updating the database with the latest feeds. The DB writes must be minimized.

Process to follow:

1. Get all feed URLs from the `feeds` collections.
2. Loop through each `feed URL` and pass them off to the `feedParser` method.
3. Get the meta `pubDate` tag of the first feed stream and compare it to the pubDate of the same feed from the DB.
	a. If the `pubDate` matches, skip all steps and move to the next iteration.
	b. If the `pubDate` differs, move to next step.
4. Get the items. Match items with existing items if any. If `date` property varies, overwrite the existing articles with the new articles. Else move on.

Alternative:

Instead of pushing everything into the job queue, let's just move the first call to adding of a new feed to and asynchronous job. And let the user subscribe to the meta add and article collection. That would make things simpler.
But do run a headless worker in the background to schedule feed updates.

UserSubscriptions:
{
	_id:
	userId:
	feedId: []
}

Feed:
{
	_id:
	title: 
	description:
	link:
	xmlurl:
	date:
	pubdate:
}

Article:
{
	_id:
	feedId:
	title:
	description:
	summary:
	link:
	origlink:
	date:
	pubdate:
	author:
	guid:
}


## Updating Feeds

The updation process is a little tricky. In order to make sure that the entire process is streamlined, we'll have to consider a number of scenarios: whether the feed meta has been updated or not, whether any of the articles has been updated, whether a new article has been published, etc. I am going to try to figure out the scenarios as I proceed with the code.

```
Loop through the list of feeds in the `Feeds` collection:

1. Create a request for each feed and get the Last-modified. Use the http headers to create request only if the document has been modified since the previous `last-modified`. 
Update: This will not work for feeds that are auto generated.

2. If the feed has been updated, check the `date` next. Compare the new meta `date` with the old one. If it has been updated, go ahead to next step.

3. Diff and patch the documents and update the feed meta in the `Feeds` collection.

4. Start reading each feed object. Diff and patch the objects with existing feedArticles. If it's a new one, insert it as a new document.
Note: Find articles using `guid` property of the article.

End of loop

Log the end of the task.


```


This turns out to be a synchronous task as a whole not utilizing the power of web workers. To fully consume that awesome power, we can instead push each req-diff-patch method as an individual task. Since, we don't need to return anything to the caller, this seems like an acceptable way.