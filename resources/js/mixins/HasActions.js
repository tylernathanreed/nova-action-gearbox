import _ from 'lodash'

export default {

	methods: {

        /**
         * Orders the specified actions by the given priority map.
         *
         * @param  {Array}       actions
         * @param  {Array|null}  priorityMap
         *
         * @return {Array}
         */
        orderActionsByPriority(actions, priorityMap = null) {

            // If a priority map was not provided, use the default priority
            if(priorityMap === null) {
                priorityMap = Nova.config.actionPriority;
            }

            // Initialize the the last index
            let lastIndex = 0;

            // Initialize the last priority index
            let lastPriorityIndex = undefined;

            // Iterate through the actions
            for(var index = 0; index < actions.length; index++) {

                // Determine the current action
                let action = actions[index];

                // Determine the action index within the priority map
                let priorityIndex = priorityMap.indexOf(action.class);

                // If the action is not listed in the priority map, skip it
                if(priorityIndex == -1) {
                    continue;
                }

                // This action is in the priority map. If we have encountered another action
                // that was also in the priority map, but it was at a lower priority, then
                // we will move this action to be above the previously encountered one.

                // Check if we've previously encountered an action lower in the priority map
                if(lastPriorityIndex !== undefined && priorityIndex < lastPriorityIndex) {

                    // Move the action action above the previously encountered action, then resort
                    return this.orderActionsByPriority(
                        _.tap(actions, () => actions.splice(lastIndex, 0, actions.splice(index, 1)[0])),
                    priorityMap);

                }

                // This action is in the priority map; but, this is the first action we have
                // encountered from the map thus far. We'll save its current index and its
                // index from the priority map, so we can compare against them later on.

                // Remember the last index and last priority index
                lastIndex = index;
                lastPriorityIndex = priorityIndex;

            }

            // Return the sorted actions
            return actions;

        },

        /**
         * Filters the specified actions by their availability.
         *
         * @param  {Array}  actions
         *
         * @return {Array}
         */
        filterActionsByAvailability(actions) {

            let _self = this;

            return _.filter(actions, function(action) {

                // If the action is an action group, keep it
                if(action.actions) {
                    return true;
                }

                // Check if the action is available for an individual resource
                if(action.availableForIndividualResource) {

                    // We must have been given a resource
                    if(_self.resource) {

                        // The resource must authorize the action
                        return _self.resource.authorizedToSee[action.uriKey];

                    }

                    // Or we must be the detail action gearbox
                    else if(_self.isForDetail && _self.detailResource) {

                        // Determine the resource from the detail component
                        return _self.detailResource.authorizedToSee[action.uriKey];

                    }

                }

                // Check if the action is available for multiple resources
                if(action.availableForMultipleResources) {

                    // We must have been given selected resources
                    if(_self.selectedResources) {

                        // At least one selected resource must authorize the action
                        // return Boolean(_.find(this.selectedResources, resource => resource.authorizedToSee[this.action.uriKey]));
                        return true;

                    }

                }

                // Not available
                return false;

            });

        },

        /**
         * Unravels the action group in the specified actions if it is the only action.
         *
         * @param  {Array}  actions
         *
         * @return {Array} 
         */
        unravelActionsForSingleActionGroup(actions) {

            // Make sure there's exactly one action
            if(actions.length != 1) {
                return actions;
            }

            // Determine the only action
            let action = _.head(actions);

            // Make sure the action is an action group
            if(!action.actions) {
                return actions;
            }

            // Unravel the action group
            return action.actions;

        },

        /**
         * Flags the specified actions as pivot actions.
         *
         * @param  {Array}  actions
         *
         * @return {Array}
         */
        flagActionsAsPivotActions(actions) {

            let _self = this;

            _.each(actions, function(action) {

                // Flag the pivot action
                action.isPivotAction = true;

                // If the pivot action is a group, flag all of its items too
                if(action.actions) {
                    _self.flagActionsAsPivotActions(action.actions);
                }

            });

        }

	},

	computed: {

        allActions: function() {

            return this.unravelActionsForSingleActionGroup(
                this.availableActionsByPriority
            );

        },

        availableActionsByPriority: function() {

            return this.filterActionsByAvailability(this.actionsByPriority);

        },

        actionsByPriority: function() {

            // Determine the resource actions
            let resourceActions = this.actions;

            // Flag each resource action as a non-pivot action
            _.each(resourceActions, function(action) {
                action.isPivotAction = false;
            });

            // Determine the pivot actions
            let pivotActions = this.pivotActions != null
                ? this.pivotActions.actions
                : [];

            // Flag each pivot action as a pivot action
            this.flagActionsAsPivotActions(pivotActions);

            // Merge the two action lists together
            let actions = resourceActions.concat(pivotActions);

            // Order the actions based on the action priority
            return this.orderActionsByPriority(actions);

        },

        /**
         * Determine if the resource has any pivot actions available.
         */
        hasPivotActions() {
            return this.pivotActions && this.pivotActions.actions.length > 0
        },

        /**
         * Determine if the resource has any actions available.
         */
        actionsAreAvailable() {
            return this.allActions.length > 0
        },

        /**
         * Get the name of the pivot model for the resource.
         */
        pivotName() {
            return this.pivotActions ? this.pivotActions.name : ''
        },

        /**
         * Get all of the available non-pivot actions for the resource.
         */
        availableActions() {
            return _(this.actions)
                .filter(action => {
                    if (this.selectedResources != 'all') {
                        return true
                    }

                    return action.availableForEntireResource
                })
                .value()
        },

        /**
         * Get all of the available pivot actions for the resource.
         */
        availablePivotActions() {
            return _(this.pivotActions ? this.pivotActions.actions : [])
                .filter(action => {
                    if (this.selectedResources != 'all') {
                        return true
                    }

                    return action.availableForEntireResource
                })
                .value()
        },

        /**
         * Returns the resource from the detail component.
         *
         * @return {Object|null}
         */
        detailResource() {

            // Walk up the parent tree
            for(let parent = this.$parent; typeof parent !== 'undefined'; parent = parent.$parent) {

                // Check if the parent has a resource
                if(typeof parent.resource !== 'undefined') {
                    return parent.resource;
                }

            }

            // Failed to find parent with a resource
            return null;

        },

	}

}