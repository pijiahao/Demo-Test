
-- --------------------------------------------------
-- Entity Designer DDL Script for SQL Server 2005, 2008, 2012 and Azure
-- --------------------------------------------------
-- Date Created: 07/23/2018 14:48:14
-- Generated from EDMX file: F:\其他\weixin\WebApp.WeiXin.TJAD\EFModel\TJADWeiXinDB.edmx
-- --------------------------------------------------

SET QUOTED_IDENTIFIER OFF;
GO
USE [TJADWeiXinDB];
GO
IF SCHEMA_ID(N'dbo') IS NULL EXECUTE(N'CREATE SCHEMA [dbo]');
GO

-- --------------------------------------------------
-- Dropping existing FOREIGN KEY constraints
-- --------------------------------------------------


-- --------------------------------------------------
-- Dropping existing tables
-- --------------------------------------------------

IF OBJECT_ID(N'[dbo].[SystemUser]', 'U') IS NOT NULL
    DROP TABLE [dbo].[SystemUser];
GO
IF OBJECT_ID(N'[dbo].[User]', 'U') IS NOT NULL
    DROP TABLE [dbo].[User];
GO

-- --------------------------------------------------
-- Creating all tables
-- --------------------------------------------------

-- Creating table 'SystemUser'
CREATE TABLE [dbo].[SystemUser] (
    [ID] int IDENTITY(1,1) NOT NULL,
    [UserName] nvarchar(50)  NOT NULL,
    [DisplayName] nvarchar(50)  NOT NULL,
    [Password] nvarchar(500)  NOT NULL,
    [UserFace] nvarchar(100)  NULL
);
GO

-- Creating table 'User'
CREATE TABLE [dbo].[User] (
    [ID] bigint IDENTITY(1,1) NOT NULL,
    [DisplayName] nvarchar(50)  NOT NULL,
    [Country] nvarchar(50)  NOT NULL,
    [Province] nvarchar(50)  NOT NULL,
    [City] nvarchar(50)  NOT NULL,
    [Sex] nvarchar(50)  NOT NULL,
    [Remark] nvarchar(200)  NULL,
    [OpenID] nvarchar(500)  NULL,
    [UserFace] nvarchar(500)  NULL,
    [CreationDateTime] datetime  NOT NULL,
    [AttentionDateTime] datetime  NULL,
    [CancelAttentionDateTime] datetime  NULL,
    [CanAttention] bit  NOT NULL
);
GO

-- --------------------------------------------------
-- Creating all PRIMARY KEY constraints
-- --------------------------------------------------

-- Creating primary key on [ID] in table 'SystemUser'
ALTER TABLE [dbo].[SystemUser]
ADD CONSTRAINT [PK_SystemUser]
    PRIMARY KEY CLUSTERED ([ID] ASC);
GO

-- Creating primary key on [ID] in table 'User'
ALTER TABLE [dbo].[User]
ADD CONSTRAINT [PK_User]
    PRIMARY KEY CLUSTERED ([ID] ASC);
GO

-- --------------------------------------------------
-- Creating all FOREIGN KEY constraints
-- --------------------------------------------------

-- --------------------------------------------------
-- Script has ended
-- --------------------------------------------------