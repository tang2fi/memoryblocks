# Dockerfile

# --- STAGE 1: Build ---
# 使用一个轻量的Node.js镜像作为基础，我们称这个阶段为 "build"
FROM node:18-alpine AS build

# 在容器内设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json (或 yarn.lock)
# 这样做可以利用Docker的缓存机制，只有当这些文件变化时才重新安装依赖
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 复制项目的所有其他文件
COPY . .

# 执行React应用的打包命令
RUN npm run build

# --- STAGE 2: Serve ---
# 使用一个非常轻量的Nginx镜像作为最终的运行环境
FROM nginx:stable-alpine

# 从 "build" 阶段复制打包好的静态文件到Nginx的默认托管目录
COPY --from=build /app/build /usr/share/nginx/html

# 复制我们自定义的Nginx配置文件
# 这个文件需要您在项目根目录中创建
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露80端口，这是Nginx默认监听的端口
EXPOSE 80

# 容器启动时执行的命令，以非后台模式启动Nginx
CMD ["nginx", "-g", "daemon off;"]
