import React, { useState } from "react";
import { Octokit } from "https://cdn.skypack.dev/@octokit/rest";

function Repo(props) {
  const name = props.repo_name;
  console.log("name in repo:", name);
  const [commits, setCommits] = useState([]);

  const ACCESS_TOKEN = process.env.REACT_APP_ACCESS_TOKEN;

  const getCommits = async (org, name) => {
    const octokit = new Octokit({
      auth: ACCESS_TOKEN,
    });
    try {
      const response = await octokit.request(
        "GET /repos/{org}/{repo_name}/commits",
        {
          org: org,
          repo_name: name,
        }
      );
      const repo_commits = response.data;

      console.log(repo_commits);
      setCommits(repo_commits);
    } catch (error) {
      console.error("Can't get commits, sorry!", error.message);
    }
  };

  console.log("commits:", commits);
  return (
    <>
      <div>{name}</div>
    </>
  );
}

export default Repo;
