from github import Github
import gitlab
import os
from pprint import PrettyPrinter

# Replace 'your_github_token' and 'your_gitlab_token' with your actual tokens
GITHUB_TOKEN = os.getenv('GITHUB_TOKEN')
GITLAB_TOKEN = os.getenv('GITLAB_TOKEN')
GITLAB_URL = 'https://gitlab.com'

def get_github_repo_info(repo_name):
    g = Github(GITHUB_TOKEN)
    repo = g.get_repo(repo_name)
    try:
        latest_release = repo.get_latest_release()
        latest_release_tag = latest_release.tag_name
        latest_release_html_url = latest_release.html_url
    except:
        latest_release_tag = "No releases"
        latest_release_html_url = None
    
    latest_commit = repo.get_commits()[0]
    default_branch = repo.default_branch
    contributors_count = repo.get_contributors().totalCount
    open_pull_requests_count = repo.get_pulls(state='open').totalCount
    try:
        readme_content = repo.get_contents("README.md", ref=default_branch).decoded_content.decode('utf-8')
    except:
        readme_content = "No README.md found"
    
    return {
        'contributors_count': contributors_count,
        'description': repo.description,
        'language': repo.language,
        'forks_count': repo.forks_count,
        'license': repo.license.name if repo.license else "No license",
        'latest_release_tag': latest_release_tag,
        'latest_release_html_url': latest_release_html_url,
        'last_commit_author': latest_commit.commit.author.name,
        'last_commit_message': latest_commit.commit.message,
        'last_commit_date': latest_commit.commit.author.date,
        'open_pull_requests_count': open_pull_requests_count,
        'owner': repo.owner.login,
        'number_of_issues': repo.open_issues_count,
        'readme_content': readme_content,
    }

def get_gitlab_repo_info(repo_name):
    gl = gitlab.Gitlab(GITLAB_URL, private_token=GITLAB_TOKEN)
    project = gl.projects.get(repo_name)
    releases = None
    releases = project.releases.list()
    if releases:
        latest_release = releases[0]
        latest_release_tag = latest_release.tag_name
        latest_release_html_url = latest_release._attrs.get('web_url', None)
    else:
        latest_release_tag = "No releases"
        latest_release_html_url = None
    
    latest_commit = project.commits.list()[0]
    open_merge_requests_count = project.mergerequests.list(state='opened').__len__()
    try:
        readme_content = project.files.get(file_path='README.md', ref=project.default_branch).decode()
    except:
        readme_content = "No README.md found"
    
    return {
        'description': project.description,
        'language': "N/A",
        'forks_count': project.forks_count,
        'license_url': project.license_url if hasattr(project, 'license_url') else "No license URL",
        'latest_release_tag': latest_release_tag,
        'latest_release_html_url': latest_release_html_url,
        'last_commit_author': latest_commit.author_name,
        'last_commit_message': latest_commit.message,
        'last_commit_date': latest_commit.committed_date,
        'open_merge_requests_count': open_merge_requests_count,
        #'owner': project.owner['username'] if project.owner else "No owner information",
        'number_of_issues': project.open_issues_count,
        'readme_content': readme_content,
    }

def examine_url_and_fetch_info(repo_url):
    if "github.com" in repo_url:
        # Extract the repo name from the URL for GitHub
        repo_name = repo_url.split("github.com/")[1]
        return get_github_repo_info(repo_name)
    elif "gitlab.com" in repo_url:
        # Extract the repo name from the URL for GitLab
        repo_name = repo_url.split("gitlab.com/")[1]
        return get_gitlab_repo_info(repo_name)
    else:
        return "Unsupported repository URL."

# Example usage
if __name__ == "__main__":
    github_url = "https://github.com/SmartDataAnalytics/RdfProcessingToolkit"
    gitlab_url = "https://gitlab.com/kupferdigital/workflows/onto-process"
    pp = PrettyPrinter(indent=4, width=80, compact=False)
    
    #print("GitHub Repository Info:")
    #pp.pprint(examine_url_and_fetch_info(github_url))
    
    print("Gitlab Repository Info:")
    pp.pprint(examine_url_and_fetch_info(gitlab_url))
