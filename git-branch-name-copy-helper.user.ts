/// <reference path="typings/jquery/jquery.d.ts" />
// ==UserScript==
// @name         Jira Git/Timetracking Heleper
// @namespace    de.netzkern
// @version      1.0.0
// @description  Some helper for lazy guys like me.
// @author       Ghodrat Ashournia . netzkern
// @match        *://jira.netzkern.de/browse/*
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/remarkable/1.6.2/remarkable.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/1.5.13/clipboard.min.js
// ==/UserScript==
/* jshint -W097 */

declare class Clipboard {
    constructor(selector?: string, options?: any);
}

module JExtensions {
    'use strict';

    interface IIconObject {
        width: number;
        height: number;
        src: string;
        title: string;
    }

    export class CopyHelper {
        private branchIcon: IIconObject;
        private timeIcon: IIconObject;
        private $header: JQuery;
        private $inputClipboard: JQuery;
        private projectNameSelector: string;
        private workItemSelector: string;
        private headerSelector: string;

        constructor() {
            this.branchIcon = {
                src: "url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/PjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDU3LjE1NyA1Ny4xNTciIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDU3LjE1NyA1Ny4xNTc7IiB4bWw6c3BhY2U9InByZXNlcnZlIj48Zz48cGF0aCBzdHlsZT0iZmlsbDojNzM4M0JGOyIgZD0iTTE1LjgwNCw1MS41MTdsLTMuOTMzLDMuOTMzYy0wLjM5MSwwLjM5MS0wLjM5MSwxLjAyMywwLDEuNDE0YzAuMTk1LDAuMTk1LDAuNDUxLDAuMjkzLDAuNzA3LDAuMjkzczAuNTEyLTAuMDk4LDAuNzA3LTAuMjkzbDMuOTMzLTMuOTMzYzAuMzkxLTAuMzkxLDAuMzkxLTEuMDIzLDAtMS40MTRTMTYuMTk1LDUxLjEyNiwxNS44MDQsNTEuNTE3eiIvPjxwYXRoIHN0eWxlPSJmaWxsOiM3MzgzQkY7IiBkPSJNNDUuMjg1LDU1LjQ1bC0zLjk2My0zLjk2M2MtMC4zOTEtMC4zOTEtMS4wMjMtMC4zOTEtMS40MTQsMHMtMC4zOTEsMS4wMjMsMCwxLjQxNGwzLjk2MywzLjk2M2MwLjE5NSwwLjE5NSwwLjQ1MSwwLjI5MywwLjcwNywwLjI5M3MwLjUxMi0wLjA5OCwwLjcwNy0wLjI5M0M0NS42NzYsNTYuNDczLDQ1LjY3Niw1NS44NCw0NS4yODUsNTUuNDV6Ii8+PC9nPjxwYXRoIHN0eWxlPSJmaWxsOiM0MjRBNjA7IiBkPSJNNDcuMzAzLDExLjEyOWMwLjAyNC0wLjAyLDAuMDUzLTAuMDI4LDAuMDc2LTAuMDVsMy0zYzAuMzkxLTAuMzkxLDAuMzkxLTEuMDIzLDAtMS40MTRzLTEuMDIzLTAuMzkxLTEuNDE0LDBsLTMsM2MtMC4wMzEsMC4wMzEtMC4wNDMsMC4wNzEtMC4wNjksMC4xMDRjLTQuNTk4LTQuMTEtMTAuNjY0LTYuNjEyLTE3LjMxNy02LjYxMlMxNS44Niw1LjY1OSwxMS4yNjEsOS43NjhjLTAuMDI2LTAuMDMzLTAuMDM4LTAuMDczLTAuMDY5LTAuMTA0bC0zLTNjLTAuMzkxLTAuMzkxLTEuMDIzLTAuMzkxLTEuNDE0LDBzLTAuMzkxLDEuMDIzLDAsMS40MTRsMywzYzAuMDIyLDAuMDIyLDAuMDUyLDAuMDMsMC4wNzYsMC4wNWMtNC41MDIsNC42NzUtNy4yNzUsMTEuMDI2LTcuMjc1LDE4LjAyOGMwLDE0LjM1OSwxMS42NDEsMjYsMjYsMjZzMjYtMTEuNjQxLDI2LTI2QzU0LjU3OCwyMi4xNTQsNTEuODA1LDE1LjgwMyw0Ny4zMDMsMTEuMTI5eiIvPjxjaXJjbGUgc3R5bGU9ImZpbGw6I0U3RUNFRDsiIGN4PSIyOC41NzgiIGN5PSIyOS4xNTciIHI9IjIyIi8+PGNpcmNsZSBzdHlsZT0iZmlsbDojRkZGRkZGOyIgY3g9IjI4LjU3OCIgY3k9IjI5LjE1NyIgcj0iMTUiLz48Zz48cGF0aCBzdHlsZT0iZmlsbDojRkZGRkZGOyIgZD0iTTI4LjU3OCw2LjE1N2MtMC41NTIsMC0xLDAuNDQ3LTEsMXYyYzAsMC41NTMsMC40NDgsMSwxLDFzMS0wLjQ0NywxLTF2LTJDMjkuNTc4LDYuNjA0LDI5LjEzMSw2LjE1NywyOC41NzgsNi4xNTd6Ii8+PHBhdGggc3R5bGU9ImZpbGw6I0ZGRkZGRjsiIGQ9Ik0yOC41NzgsNDguMTU3Yy0wLjU1MiwwLTEsMC40NDctMSwxdjJjMCwwLjU1MywwLjQ0OCwxLDEsMXMxLTAuNDQ3LDEtMXYtMkMyOS41NzgsNDguNjA0LDI5LjEzMSw0OC4xNTcsMjguNTc4LDQ4LjE1N3oiLz48cGF0aCBzdHlsZT0iZmlsbDojRkZGRkZGOyIgZD0iTTUwLjU3OCwyOC4xNTdoLTJjLTAuNTUyLDAtMSwwLjQ0Ny0xLDFzMC40NDgsMSwxLDFoMmMwLjU1MiwwLDEtMC40NDcsMS0xUzUxLjEzMSwyOC4xNTcsNTAuNTc4LDI4LjE1N3oiLz48cGF0aCBzdHlsZT0iZmlsbDojRkZGRkZGOyIgZD0iTTkuNTc4LDI5LjE1N2MwLTAuNTUzLTAuNDQ4LTEtMS0xaC0yYy0wLjU1MiwwLTEsMC40NDctMSwxczAuNDQ4LDEsMSwxaDJDOS4xMzEsMzAuMTU3LDkuNTc4LDI5LjcwOSw5LjU3OCwyOS4xNTd6Ii8+PHBhdGggc3R5bGU9ImZpbGw6I0ZGRkZGRjsiIGQ9Ik0xOC40NDUsOS42MDRjLTAuMjc3LTAuNDc4LTAuODg4LTAuNjQ0LTEuMzY2LTAuMzY2Yy0wLjQ3OCwwLjI3Ni0wLjY0MiwwLjg4OC0wLjM2NiwxLjM2NmwxLDEuNzMyYzAuMTg2LDAuMzIsMC41MjEsMC41LDAuODY3LDAuNWMwLjE2OSwwLDAuMzQxLTAuMDQzLDAuNDk5LTAuMTM0YzAuNDc4LTAuMjc2LDAuNjQyLTAuODg4LDAuMzY2LTEuMzY2TDE4LjQ0NSw5LjYwNHoiLz48cGF0aCBzdHlsZT0iZmlsbDojRkZGRkZGOyIgZD0iTTM5LjQ0NSw0NS45NzdjLTAuMjc3LTAuNDc4LTAuODg4LTAuNjQzLTEuMzY2LTAuMzY2Yy0wLjQ3OCwwLjI3Ni0wLjY0MiwwLjg4OC0wLjM2NiwxLjM2NmwxLDEuNzMyYzAuMTg2LDAuMzIsMC41MjEsMC41LDAuODY3LDAuNWMwLjE2OSwwLDAuMzQxLTAuMDQzLDAuNDk5LTAuMTM0YzAuNDc4LTAuMjc2LDAuNjQyLTAuODg4LDAuMzY2LTEuMzY2TDM5LjQ0NSw0NS45Nzd6Ii8+PHBhdGggc3R5bGU9ImZpbGw6I0ZGRkZGRjsiIGQ9Ik0xMS43NTgsMTguMjlsLTEuNzMyLTFjLTAuNDc5LTAuMjc2LTEuMDktMC4xMTEtMS4zNjYsMC4zNjZjLTAuMjc2LDAuNDc5LTAuMTEyLDEuMDksMC4zNjYsMS4zNjZsMS43MzIsMWMwLjE1OCwwLjA5MSwwLjMzLDAuMTM0LDAuNDk5LDAuMTM0YzAuMzQ2LDAsMC42ODItMC4xOCwwLjg2Ny0wLjVDMTIuNCwxOS4xNzgsMTIuMjM2LDE4LjU2NywxMS43NTgsMTguMjl6Ii8+PHBhdGggc3R5bGU9ImZpbGw6I0ZGRkZGRjsiIGQ9Ik00OC4xMzEsMzkuMjlsLTEuNzMyLTFjLTAuNDgtMC4yNzgtMS4wOS0wLjExMS0xLjM2NiwwLjM2NmMtMC4yNzYsMC40NzktMC4xMTIsMS4wOSwwLjM2NiwxLjM2NmwxLjczMiwxYzAuMTU4LDAuMDkxLDAuMzMsMC4xMzQsMC40OTksMC4xMzRjMC4zNDYsMCwwLjY4Mi0wLjE4LDAuODY3LTAuNUM0OC43NzMsNDAuMTc4LDQ4LjYwOSwzOS41NjcsNDguMTMxLDM5LjI5eiIvPjxwYXRoIHN0eWxlPSJmaWxsOiNGRkZGRkY7IiBkPSJNMTAuNzU4LDM4LjI5bC0xLjczMiwxYy0wLjQ3OCwwLjI3Ni0wLjY0MiwwLjg4OC0wLjM2NiwxLjM2NmMwLjE4NiwwLjMyLDAuNTIxLDAuNSwwLjg2NywwLjVjMC4xNjksMCwwLjM0MS0wLjA0MywwLjQ5OS0wLjEzNGwxLjczMi0xYzAuNDc4LTAuMjc2LDAuNjQyLTAuODg4LDAuMzY2LTEuMzY2QzExLjg0NywzOC4xNzksMTEuMjM3LDM4LjAxMiwxMC43NTgsMzguMjl6Ii8+PHBhdGggc3R5bGU9ImZpbGw6I0ZGRkZGRjsiIGQ9Ik00NS45LDIwLjE1N2MwLjE2OSwwLDAuMzQxLTAuMDQzLDAuNDk5LTAuMTM0bDEuNzMyLTFjMC40NzgtMC4yNzYsMC42NDItMC44ODgsMC4zNjYtMS4zNjZjLTAuMjc3LTAuNDc4LTAuODg4LTAuNjQzLTEuMzY2LTAuMzY2bC0xLjczMiwxYy0wLjQ3OCwwLjI3Ni0wLjY0MiwwLjg4OC0wLjM2NiwxLjM2NkM0NS4yMTgsMTkuOTc3LDQ1LjU1NCwyMC4xNTcsNDUuOSwyMC4xNTd6Ii8+PHBhdGggc3R5bGU9ImZpbGw6I0ZGRkZGRjsiIGQ9Ik0xOS4wNzgsNDUuNjExYy0wLjQ4MS0wLjI3Ni0xLjA5LTAuMTExLTEuMzY2LDAuMzY2bC0xLDEuNzMyYy0wLjI3NiwwLjQ3OS0wLjExMiwxLjA5LDAuMzY2LDEuMzY2YzAuMTU4LDAuMDkxLDAuMzMsMC4xMzQsMC40OTksMC4xMzRjMC4zNDYsMCwwLjY4Mi0wLjE4LDAuODY3LTAuNWwxLTEuNzMyQzE5LjcyLDQ2LjQ5OCwxOS41NTYsNDUuODg3LDE5LjA3OCw0NS42MTF6Ii8+PHBhdGggc3R5bGU9ImZpbGw6I0ZGRkZGRjsiIGQ9Ik00MC4wNzgsOS4yMzhjLTAuNDgtMC4yNzctMS4wOS0wLjExMS0xLjM2NiwwLjM2NmwtMSwxLjczMmMtMC4yNzYsMC40NzktMC4xMTIsMS4wOSwwLjM2NiwxLjM2NmMwLjE1OCwwLjA5MSwwLjMzLDAuMTM0LDAuNDk5LDAuMTM0YzAuMzQ2LDAsMC42ODItMC4xOCwwLjg2Ny0wLjVsMS0xLjczMkM0MC43MiwxMC4xMjUsNDAuNTU2LDkuNTE0LDQwLjA3OCw5LjIzOHoiLz48L2c+PHBhdGggc3R5bGU9ImZpbGw6IzQyNEE2MDsiIGQ9Ik0zOS41NzgsMjguMTU3aC03LjE0MmMtMC4zNjQtMS4zOTktMS40NTktMi40OTQtMi44NTgtMi44NThWMTUuMTU3YzAtMC41NTMtMC40NDgtMS0xLTFzLTEsMC40NDctMSwxdjEwLjE0MmMtMS43MiwwLjQ0Ny0zLDEuOTk5LTMsMy44NThjMCwyLjIwNiwxLjc5NCw0LDQsNGMxLjg1OCwwLDMuNDExLTEuMjgsMy44NTgtM2g3LjE0MmMwLjU1MiwwLDEtMC40NDcsMS0xUzQwLjEzMSwyOC4xNTcsMzkuNTc4LDI4LjE1N3ogTTI4LjU3OCwzMS4xNTdjLTEuMTAzLDAtMi0wLjg5Ny0yLTJzMC44OTctMiwyLTJzMiwwLjg5NywyLDJTMjkuNjgxLDMxLjE1NywyOC41NzgsMzEuMTU3eiIvPjxwYXRoIHN0eWxlPSJmaWxsOiM3MzgzQkY7IiBkPSJNNTQuNDkzLDIuMDg2YzIuNzgxLDIuNzgxLDIuNzgxLDcuMjksMCwxMC4wNzFMNDQuNDIxLDIuMDg2QzQ3LjIwMy0wLjY5NSw1MS43MTEtMC42OTUsNTQuNDkzLDIuMDg2eiIvPjxwYXRoIHN0eWxlPSJmaWxsOiM3MzgzQkY7IiBkPSJNMi42NjQsMi4wODZjLTIuNzgxLDIuNzgxLTIuNzgxLDcuMjksMCwxMC4wNzFMMTIuNzM1LDIuMDg2QzkuOTU0LTAuNjk1LDUuNDQ1LTAuNjk1LDIuNjY0LDIuMDg2eiIvPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjwvc3ZnPg==)",
                width: 30,
                height: 30,
                title:"Copy formated task name for time tracking"
            };
            this.timeIcon = {
                src: "url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmVyc2lvbj0iMS4xIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiI+ICAgIDxwYXRoIGQ9Ik0gNTAyLjM0MTExLDI3OC44MDM2NCAyNzguNzk4MDksNTAyLjM0MjE2IGMgLTEyLjg2Nzk0LDEyLjg3NzEyIC0zMy43NDc4NCwxMi44NzcxMiAtNDYuNjMzMDUsMCBsIC00Ni40MTUyLC00Ni40MjQ0OCA1OC44ODAyOCwtNTguODgzNjQgYyAxMy42ODY0Nyw0LjYyMDkyIDI5LjM3OTQsMS41MTk0OCA0MC4yODM3OCwtOS4zODczMiAxMC45NzAxMiwtMTAuOTc0OCAxNC4wNDMwNywtMjYuODAyODggOS4zMDQ2NSwtNDAuNTM3IGwgNTYuNzU0MDEsLTU2Ljc0ODQ0IGMgMTMuNzMzODMsNC43MzQwNCAyOS41NjgyOSwxLjY3Mzg0IDQwLjUzODQyLC05LjMxMTU2IDE1LjMyMjk3LC0xNS4zMTg4IDE1LjMyMjk3LC00MC4xNTE5NiAwLC01NS40ODM1NiAtMTUuMzM0MSwtMTUuMzMyMiAtNDAuMTYxNzUsLTE1LjMzMjIgLTU1LjUwMjU0LDAgLTExLjUyNDU0LDExLjUzNTkyIC0xNC4zNzU3MiwyOC40NzE3MiAtOC41MzE4Miw0Mi42NzIyIGwgLTUyLjkzMzg2LDUyLjkzMDQ4IDAsLTEzOS4yODUxMiBjIDMuNzMyNjcsLTEuODQ5OTYgNy4yNTg2MywtNC4zMTM5MiAxMC4zNzExNCwtNy40MTc1NiAxNS4zMjI5NSwtMTUuMzIxNiAxNS4zMjI5NSwtNDAuMTUxOTYgMCwtNTUuNDk2OTYgLTE1LjMyMjk2LC0xNS4zMTY2IC00MC4xNjg0NCwtMTUuMzE2NiAtNTUuNDgwMjUsMCAtMTUuMzIyOTYsMTUuMzQ1IC0xNS4zMjI5Niw0MC4xNzUzNiAwLDU1LjQ5Njk2IDMuNzg3MjcsMy43ODI4OCA4LjE3Mjk5LDYuNjQ0NzIgMTIuODUyMzQsOC41NjA0IGwgMCwxNDAuNTczMzYgYyAtNC42NzkzNSwxLjkxNTY4IC05LjA1NDQ4LDQuNzUzNTYgLTEyLjg1MjM0LDguNTYyNjQgLTExLjYwNTMzLDExLjYwMTY4IC0xNC4zOTgwMSwyOC42Mzc4IC04LjQ0NDksNDIuODkyMzIgTCAxNjIuOTM5ODEsNDMzLjExMzM2IDkuNjU1NzQwNiwyNzkuODM5NDggYyAtMTIuODc0MzIwOSwtMTIuODg3NjggLTEyLjg3NDMyMDksLTMzLjc2OCAwLC00Ni42NDQ1NiBMIDIzMy4yMDk3OCw5LjY1NTkyIGMgMTIuODcwMTcsLTEyLjg3NDU2IDMzLjc0MzM4LC0xMi44NzQ1NiA0Ni42MzMwNSwwIGwgMjIyLjQ5ODI4LDIyMi41MDMxNiBjIDEyLjg3ODUyLDEyLjg3ODc2IDEyLjg3ODUyLDMzLjc2OTY4IDAsNDYuNjQ0NTYiICAgICAgICAgIHN0eWxlPSJmaWxsOiNmMDNjMmU7c3Ryb2tlOm5vbmUiLz48L3N2Zz4=)",
                width: 30,
                height: 30,
                title:"Copy formated branch name"
            };
            this.headerSelector = '.issue-header-content > header.aui-page-header > .aui-page-header-inner';
            this.projectNameSelector = '.issue-link';
            this.workItemSelector = '#summary-val';
            this.$header = $(this.headerSelector);
        }

        private createButtons(): JQuery {
            var $container = this.createElement('div');
            $container.addClass('hipchat-configuration-toolbar');
            // create buttons
            var $branchIconButton = this.createIcon(this.branchIcon);
            this.setupBranchCopyHandler($branchIconButton);
            var $timeIconButton = this.createIcon(this.timeIcon);
            this.setupTimeCopyHandler($timeIconButton);
            // add buttons to container
            $container.append($branchIconButton);
            $container.append($timeIconButton);
            return $container;
        }

        private createIcon(icon: IIconObject): JQuery {
            var $button = $('<button/>');
            $button.css("background-image", icon.src);
            $button.css("background-size", 'cover');
            $button.css("background-color", 'transparent');
            $button.css("border", 'none');
            $button.attr("title", icon.title);
            $button.width(icon.width);
            $button.height(icon.height);
            $button.addClass('copy-handler');
            return $button;
        }

        private createElement(element: string) {
            return $('<' + element + '/>');
        }

        initHeader() {
            if (this.$header.length) {
                this.$inputClipboard = $('<input>');
                this.$inputClipboard.attr('type', 'hidden').appendTo(this.$header);
                let $buttons = this.createButtons();
                this.$header.append($buttons);
                let clipboard = new Clipboard('.copy-handler', {
                    text: (trigger:any) => {
                        return this.$inputClipboard.val();
                    }
                });
            }
        }

        private setupBranchCopyHandler($button: JQuery) {
            $button.on('click',
                () => {
                    let name = this.getRawName();
                    this.$inputClipboard.val(name);
                });
        }

        private setupTimeCopyHandler($button: JQuery) {
            $button.on('click.jira-ext', () => {
                let name = this.generateBranchName(this.getRawName());
                this.$inputClipboard.val(name);
            });
        }

        private getRawName(): string {
            var $el = this.$header.find(this.projectNameSelector);
            if ($el.length) {
                let projectName = $el.text();
                let workItem = '';
                $el = $(this.workItemSelector);
                if ($el.length) {
                    workItem = $el.text();
                }
                return projectName + ': ' + workItem;
            }
            return '';
        }

        private generateBranchName(rawName: string): string {
            let branchName: string = rawName;
            branchName = branchName.replace(/\s/g, '_');
            branchName = branchName.replace(/-/g, '_');
            branchName = branchName.replace(/ä/g, 'ae');
            branchName = branchName.replace(/Ä/g, 'Ae');
            branchName = branchName.replace(/ö/g, 'oe');
            branchName = branchName.replace(/Ö/g, 'Oe');
            branchName = branchName.replace(/ü/g, 'ue');
            branchName = branchName.replace(/Ü/g, 'Ue');
            branchName = branchName.replace(/ß/g, 'ss');
            branchName = branchName.replace(/\W/g, '');
            return branchName;
        }

    }

    $(document).ready(() => {
        var copyHelper = new CopyHelper();
        copyHelper.initHeader();
    });
}
