/**
 *  @file
 *  @copyright defined in eos/LICENSE.txt
 */
#include <eosio/verifier_api_plugin/verifier_api_plugin.hpp>
#include <eosio/chain/exceptions.hpp>

#include <fc/io/json.hpp>

namespace eosio {

using namespace eosio;

static appbase::abstract_plugin& _verifier_api_plugin = app().register_plugin<verifier_api_plugin>();

verifier_api_plugin::verifier_api_plugin(){}
verifier_api_plugin::~verifier_api_plugin(){}

void verifier_api_plugin::set_program_options(options_description&, options_description&) {}
void verifier_api_plugin::plugin_initialize(const variables_map&) {}

#define CALL(api_name, api_handle, api_namespace, call_name) \
{std::string("/v1/" #api_name "/" #call_name), \
   [this, api_handle](string, string body, url_response_callback cb) mutable { \
          try { \
             if (body.empty()) body = "{}"; \
             auto result = api_handle.call_name(fc::json::from_string(body).as<api_namespace::call_name ## _params>()); \
             cb(200, fc::json::to_string(result)); \
          } catch (...) { \
             http_plugin::handle_exception(#api_name, #call_name, body, cb); \
          } \
       }}

#define CHAIN_RO_CALL(call_name) CALL(verifier, ro_api, verifier_apis::read_only, call_name)

void verifier_api_plugin::plugin_startup() {
   ilog( "starting verifier_api_plugin" );
   auto ro_api = app().get_plugin<verifier_plugin>().get_read_only_api();

   app().get_plugin<http_plugin>().add_api({
     CHAIN_RO_CALL(get_access_token)
   });
}

void verifier_api_plugin::plugin_shutdown() {}

}
