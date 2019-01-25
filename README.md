# FENews.org

[![Build Status](https://travis-ci.com/FENews/FENews.org.svg?branch=master)](https://travis-ci.com/FENews/FENews.org)


FENews 是由一群热爱技术的前端小伙伴自发组成的团队。团队会定期创作/翻译前端相关的技术文章，同时我们也欢迎外部投稿或加入我们的核心编辑团队。如果您对我们感兴趣，请关注我们的公众号：

![公众号](https://github.com/FENews/FENews.org/blob/master/static/media/qrcode.jpg)

## 开始写作
1. 首先，fork 这个项目。
2. `clone` 你 fork 后的项目到你的本地。
3. 进入项目根目录，执行 `yarn` 安装依赖。
4. 为你 fork 后的项目添加 `upstream`
   ```
    git remote add upstream git@github.com:FENews/FENews.org.git
    git fetch upstream

    # 每次开始写作前，同步 upstream 的 master 分支
    git pull upstream master
   ```
5. `yarn develop` 启动开发环境。
6. 进入项目根目录，在 `content/posts` 文件夹下面新建markdown文件，文件名格式：`2019-01-25---Perfecting-the-Art-of-Perfection.md`。
7. 开始编辑上一步创建的文章。
8. 完成后提 `PR`，等待审核校对完成后方可发布。

<!-- ## Contributors -->