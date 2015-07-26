# Feed Parser

The fundamental challenge to a successful feed parser algorithm is the performance hit the server will take. Since, we are going to follow the naive approach of pinging the feeds after a certain interval, we must make sure that we are not naively updating the database with the latest feeds. The DB writes must be minimized.

Process to follow:

1. Get all feed URLs from the `feeds` collections.
2. Loop through each `feed URL` and pass them off to the `feedParser` method.
3. Get the meta `pubDate` tag of the first feed stream and compare it to the pubDate of the same feed from the DB.
	a. If the `pubDate` matches, skip all steps and move to the next iteration.
	b. If the `pubDate` differs, move to next step.
4. Get the items. Match items with existing items if any. If `date` property varies, overwrite the existing articles with the new articles. Else move on.


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