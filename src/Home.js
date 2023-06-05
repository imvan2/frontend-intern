import React, { useState } from "react";
import { Octokit } from "https://cdn.skypack.dev/@octokit/rest";
import "./Home.css";
import "./App.css";

function Home() {
  const ACCESS_TOKEN = process.env.REACT_APP_ACCESS_TOKEN;
  console.log(ACCESS_TOKEN);
  const [org, setOrg] = useState("Netflix");
  const [click, setClick] = useState(false);

  const [repos, setRepos] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setOrg(e.target.value);
    getRepos(org);
    setClick(true);
  };

  const getRepos = async (org) => {
    const data = [];
    const octokit = new Octokit({
      auth: ACCESS_TOKEN,
    });
    try {
      const response = await octokit.request("GET /orgs/{org}/repos", {
        org: org,
      });
      const repositories = response.data;

      for (let i = 0; i < repositories.length; i++) {
        const results = {};
        results["name"] = repositories[i]["name"];
        results["language"] = repositories[i]["language"];
        results["description"] = repositories[i]["description"];
        results["stars_count"] = repositories[i]["stargazers_count"];
        results["forks_count"] = repositories[i]["forks_count"];
        results["created_at"] = repositories[i]["created_at"];
        data.push(results);
      }
      setRepos(data);
    } catch (error) {
      console.error("Can't get repos, sorry!", error.message);
    }
  };

  return (
    <>
      <h1>Search for a GitHub organization</h1>
      <div>
        <div>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="githubOrgSearch" hidden>
                Search for GitHub organization
              </label>
              <input
                onChange={(e) => setOrg(e.target.value)}
                type="text"
                className="form-control"
                id="githubOrgSearch"
                aria-describedby="githubOrgSearch"
                placeholder="Search for a GitHub Organization"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </form>
        </div>
        <div className={click ? "search" : "no-search"}>
          <h1>Repos</h1>
          {repos
            .sort((a, b) => {
              if (a.stars_count > b.stars_count) return -1;
              else if (a.stars_count < b.stars_count) return 1;
              return 0;
            })
            .map((repo, index) => {
              return (
                <ul key={index} className="card" style={{ width: "18rem" }}>
                  <li>
                    <a href="/" className="btn btn-primary">
                      <h2>Name:</h2>
                    </a>
                    {repo.name}
                  </li>
                  <li>
                    <h2>Language:</h2> {repo.language}
                  </li>
                  <li>
                    <h2>Description:</h2> {repo.description}
                  </li>
                  <li>
                    <h2>Star Count:</h2> {repo.star_count}
                  </li>
                  <li>
                    <h2>Forks Count:</h2> {repo.forks_count}
                  </li>
                  <li>
                    <h2>Created At:</h2> {repo.created_at}
                  </li>
                </ul>
              );
            })}
        </div>
      </div>
    </>
  );
}

export default Home;
